import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown=true)
public class CampQueryParam {
	private int id;
	private String alias;
	private int parkId;
	
	private String contractCode;
	private String siteTypeFilter;
	private String submitSiteForm;
	private String search;
	private String currentMaximumWindow;
	private String arrivalDate;
	private String departureDate;
	
	@JsonProperty("camping_common_3012")
	private String campingCommon3012;

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

	public int getParkId() {
		return parkId;
	}

	public void setParkId(int parkId) {
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
