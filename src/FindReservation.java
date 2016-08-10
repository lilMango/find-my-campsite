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
		
	public static final int DELAY_EXEC_SECONDS = 0;
	public static int PERIOD_EXEC_SECONDS;

	public static void main(String[] args)
	{	
		ConfigLoader configLoader = ConfigLoader.getInstance();
		Config config = ConfigLoader.getConfig();
		
		PERIOD_EXEC_SECONDS = config.getScriptPeriodSeconds();
		System.out.println("Loading from config.json:");
		System.out.println("period of execution(seconds):"+PERIOD_EXEC_SECONDS);
		System.out.println("Gmail user:"+config.getFromGmailUsername());
		System.out.println("Gmail pass:"+config.getFromGmailPassword());
		System.out.println("Email recipient:"+config.getEmailRecipient());
		
		List<CampQueryParam> cqpArr = config.getCampParameters();
		for(CampQueryParam c:cqpArr) {
			System.out.println(c.toString());
		}
		
		
		//scheduler script
		Runnable helloRunnable = new Runnable() {
	    	public void run() {

	        	try { 
		        	
		        	//CampQueryParam cqp = CampQueryParam.getSampleZionQuery();
	        		List<CampQueryParam> cqpArr = ConfigLoader.getConfig().getCampParameters();
	        		for(CampQueryParam cqp:cqpArr) {
	        			System.out.println("######## Querying:"+cqp.getAlias()+" ...");
	        			boolean found = findReservations(cqp);					
						
						if (found) {
							MailSender mailSender = MailSender.getInstance();
							String msg = String.format("%s camp spot open! Go ahead and book it: http://www.recreation.gov", cqp.getAlias());
							mailSender.sendMessage(msg);
						}
	        		}
	        		
		        	
					
				} catch (Exception e) {
					e.printStackTrace();				
				}
    		}
		};

		ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);
		executor.scheduleAtFixedRate(helloRunnable, DELAY_EXEC_SECONDS, PERIOD_EXEC_SECONDS, TimeUnit.SECONDS);
			

	}
	
	// Grab the JSESSIONID cookie that is needed to make the next call to find available reservations
	public static String getCookie(CampQueryParam campQueryParams) throws Exception{
		String campName="";
		String parkId="";
		
		campName = campQueryParams.getCampName();
		parkId = campQueryParams.getParkId()+"";
		
		// This initial call will set/give us the cookie we need
		String urlString = String.format("http://www.recreation.gov/camping/%s/r/campgroundDetails.do?contractCode=NRSO&parkId=%s",campName,parkId);
		System.out.println(urlString);
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
		System.out.println("No cookie found!");
		return "";
	}

	// Call to find reservations for a given campground
	/*
	 * Returns true if found at least one campsite
	 */
	public static boolean findReservations(CampQueryParam campQueryParams) throws Exception{
		
		String jSessionId = getCookie(campQueryParams);
		
		URL url = new URL("http://www.recreation.gov/campsiteSearch.do");
		
		// These are the parameters for our search. Will most likely need to adjust dates and camping_common_3012(num of people) only
        Map<String,Object> params = campQueryParams.getParamsMap();
        

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
        		
        		int numFound = parseNumber(line);        		
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

    	}catch(IOException e){
    		e.printStackTrace();
    	}
	}
}
