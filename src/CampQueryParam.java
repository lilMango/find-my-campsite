import java.util.LinkedHashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown=true)
public class CampQueryParam {
	private int id;
	private String alias = ""; //Friendly user term
	private String campName = ""; //for url
	private String parkId = "";
	
	private String contractCode = "NRSO";
	private String siteTypeFilter = "ALL";
	private String submitSiteForm = "true";
	private String search = "site";
	private String currentMaximumWindow = "12";
	private String arrivalDate = "";
	private String departureDate = "";
	
	
	@JsonProperty("camping_common_3012")
	private String campingCommon3012 = "4"; //(num of people)

	public Map<String,Object> getParamsMap() {
		Map<String,Object> params = new LinkedHashMap<>();
		
		params.put("id", id);
		params.put("campName", campName);
		params.put("parkId", parkId);
		params.put("contractCode", contractCode);
		params.put("siteTypeFilter", siteTypeFilter);
		params.put("search", search);
		params.put("currentMaximumWindow", currentMaximumWindow);
		params.put("arrivalDate", arrivalDate);
		params.put("departureData", departureDate);
		params.put("camping_common_3012", campingCommon3012);
		
		return params;
	}
	
	public String toString() {
		Map<String,Object> params = getParamsMap();
		
		StringBuffer sb = new StringBuffer();sb.append("{");
		
		for (Map.Entry<String, Object> entry : params.entrySet()) {
			sb.append(entry.getKey());
			sb.append(":");
			sb.append(entry.getValue());
			sb.append(",");
		    //System.out.println(entry.getKey() + ": " + entry.getValue());
		}
		sb.append("}");
		return sb.toString();
	}
	
	public static CampQueryParam getSampleZionQuery() {
		CampQueryParam cqp = new CampQueryParam();
		cqp.setAlias("Zion-Watchman campgruond");
    	cqp.setCampName("watchman-campground-ut");
    	cqp.setParkId("70923");
        cqp.setContractCode("NRSO");        
        cqp.setSiteTypeFilter("ALL");
        cqp.setSubmitSiteForm("true");
        cqp.setSearch("site");
        cqp.setCurrentMaximumWindow("12");
        cqp.setArrivalDate("Fri Sep 02 2016");
        cqp.setDepartureDate("Sun Sep 04 2016");
//        params.put("availStatus", "");
//        params.put("flexDates", "");
//        params.put("loop", "");
//        params.put("siteCode", "");
//        params.put("lookingFor", "");
//        params.put("camping_common_218", "0");		            
//        params.put("camping_common_3013", "0");
		return cqp;
	}
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
	
	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}


	public String getCampName() {
		return campName;
	}

	public void setCampName(String campName) {
		this.campName = campName;
	}

	public String getParkId() {
		return parkId;
	}

	public void setParkId(String parkId) {
		this.parkId = parkId;
	}

	public String getContractCode() {
		return contractCode;
	}

	public void setContractCode(String contractCode) {
		this.contractCode = contractCode;
	}

	public String getSiteTypeFilter() {
		return siteTypeFilter;
	}

	public void setSiteTypeFilter(String siteTypeFilter) {
		this.siteTypeFilter = siteTypeFilter;
	}

	public String getSubmitSiteForm() {
		return submitSiteForm;
	}

	public void setSubmitSiteForm(String submitSiteForm) {
		this.submitSiteForm = submitSiteForm;
	}

	public String getSearch() {
		return search;
	}

	public void setSearch(String search) {
		this.search = search;
	}

	public String getCurrentMaximumWindow() {
		return currentMaximumWindow;
	}

	public void setCurrentMaximumWindow(String currentMaximumWindow) {
		this.currentMaximumWindow = currentMaximumWindow;
	}

	public String getArrivalDate() {
		return arrivalDate;
	}

	public void setArrivalDate(String arrivalDate) {
		this.arrivalDate = arrivalDate;
	}

	public String getDepartureDate() {
		return departureDate;
	}

	public void setDepartureDate(String departureDate) {
		this.departureDate = departureDate;
	} 
}
