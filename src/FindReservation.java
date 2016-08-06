import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class FindReservation {
	
	public static final String YOSEMITE_PARKID = "70925"; // Yosemite - Upper Pines
	public static final String ZION_PARKID = "70923"; // Zion - Watchman

	public static final int DELAY_EXEC_SECONDS = 0;
	public static final int PERIOD_EXEC_SECONDS = 120;

	public static void main(String[] args)
	{	

		//scheduler script
		Runnable helloRunnable = new Runnable() {
	    	public void run() {

	        	try { 
		        	String parkId = ZION_PARKID;
					String jSessionId = getCookie(parkId);
					boolean found = findReservations(parkId, jSessionId);
				} catch (Exception e) {
					e.printStackTrace();
				}
    		}
		};

		ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);
		executor.scheduleAtFixedRate(helloRunnable, DELAY_EXEC_SECONDS, PERIOD_EXEC_SECONDS, TimeUnit.SECONDS);
			

	}
	
	// Grab the JSESSIONID cookie that is needed to make the next call to find available reservations
	public static String getCookie(String parkId) throws Exception{
		// This initial call will set/give us the cookie we need
		String urlString = "http://www.recreation.gov/camping/watchman-campground-ut/r/campgroundDetails.do?contractCode=NRSO&parkId=" + parkId;
		URL url = new URL(urlString);
		HttpURLConnection conn = (HttpURLConnection)url.openConnection();
		
		Map<String, List<String>> headerFields = conn.getHeaderFields();
		Set<String> headerFieldsSet = headerFields.keySet();
		Iterator<String> hearerFieldsIter = headerFieldsSet.iterator();
		
		// Look through each cookie in the response
		while (hearerFieldsIter.hasNext()) {
			
			 String headerFieldKey = hearerFieldsIter.next();
			 
			 if ("Set-Cookie".equalsIgnoreCase(headerFieldKey)) {
				 
				 List<String> headerFieldValue = headerFields.get(headerFieldKey);
				 
				 for (String headerValue : headerFieldValue) {
					 
					String[] fields = headerValue.split(";\b*");

					String cookieValue = fields[0];
					
					// Correct cookie found
					if (cookieValue.contains("JSESSIONID")) {
						System.out.println(cookieValue);
						return cookieValue;
					}
				 }
			 }
		}
		
		return "";
	}

	// Call to find reservations for a given campground
	/*
	 * Returns true if found at least one campsite
	 */
	public static boolean findReservations(String parkId, String jSessionId) throws Exception{
		
		URL url = new URL("http://www.recreation.gov/campsiteSearch.do");
		
		// These are the parameters for our search. Will most likely need to adjust dates and camping_common_3012(num of people) only
        Map<String,Object> params = new LinkedHashMap<>();
        params.put("contractCode", "NRSO");
        params.put("parkId", parkId);
        params.put("siteTypeFilter", "ALL");
        params.put("submitSiteForm", "true");
        params.put("search", "site");
        params.put("submitSiteForm", "true");
        params.put("currentMaximumWindow", "12");
        params.put("arrivalDate", "Fri Aug 26 2016");
        params.put("departureDate", "Sun Aug 28 2016");
//        params.put("availStatus", "");
//        params.put("flexDates", "");
//        params.put("loop", "");
//        params.put("siteCode", "");
//        params.put("lookingFor", "");
//        params.put("camping_common_218", "0");
        params.put("camping_common_3012", "4");
//        params.put("camping_common_3013", "0");

        // Build our request with the given params
        StringBuilder postData = new StringBuilder();
        for (Map.Entry<String,Object> param : params.entrySet()) {
            if (postData.length() != 0) postData.append('&');
            postData.append(URLEncoder.encode(param.getKey(), "UTF-8"));
            postData.append('=');
            postData.append(URLEncoder.encode(String.valueOf(param.getValue()), "UTF-8"));
        }
        //System.out.println(postData.toString());
        byte[] postDataBytes = postData.toString().getBytes("UTF-8");

        // Make the connection, be sure to set JSESSIONID or call may return all campsites
        HttpURLConnection conn = (HttpURLConnection)url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        conn.setRequestProperty("Content-Length", String.valueOf(postDataBytes.length));
        conn.setRequestProperty("Cookie", jSessionId);
        conn.setDoOutput(true);
        conn.getOutputStream().write(postDataBytes);
        
        //conn.setDoOutput(true);
        //conn.getOutputStream().write(postDataBytes);

        BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
        String line = in.readLine();
        while (line != null){
        	
        	//System.out.println(line);
        	// This line should tell us the number of sites available
        	// TODO - If this runs on a continuous script or something, maybe send a text or email alert here when this isn't 0
        	if (line.contains("site(s) available") || line.contains("site(s) found")){
        		System.out.println(line);
        		int numFound = parseNumber(line);
        		System.out.println("We found " + numFound+ " sites available");
        		logResult(parsePhrase(line));
        		if (numFound>0) {
        			logResult("Found an available site!!");
        			return true;
        		}
        	}
        	line = in.readLine();
        }

        return false;
	}

	/*
		Parses expression for the number
	*	returns number, else -1 if err
	*/
	public static int parseNumber(String line) {
		String REGEX = "<div class='matchSummary'>([\\d]*?) site";
		Pattern pattern = Pattern.compile(REGEX,Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(line);
        
        //extract exact number
        while (matcher.find()) {
        		String tmp = matcher.group(1);
                System.out.println(tmp);
                return Integer.parseInt(tmp);
        }		

		return -1;
	}
	
	/*
	* Parse for sentence
	*/ 
	public static String parsePhrase(String line) {
		String REGEX = "<div class='matchSummary'>([\\s\\S]*?)<a";
		Pattern pattern = Pattern.compile(REGEX,Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(line);
        
        //extract exact number
        while (matcher.find()) {
        		String tmp = matcher.group(1);
                System.out.println(tmp);
                return tmp;
        }		

		return "";
	}
	public static void logResult(String line) {
    	try{
    		File file =new File("log-results.txt");

    		//if file doesnt exists, then create it
    		if(!file.exists()){
    			file.createNewFile();
    		}

    		//true = append file
    		FileWriter fileWritter = new FileWriter(file.getName(),true);
	        BufferedWriter bufferedWriter = new BufferedWriter(fileWritter);
	        bufferedWriter.write(line);
	        bufferedWriter.newLine();
	        bufferedWriter.close();

	        System.out.println("Done");

    	}catch(IOException e){
    		e.printStackTrace();
    	}
	}
}
