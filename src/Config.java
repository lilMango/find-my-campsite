import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class Config {
	private int scriptPeriodSeconds;
	private String fromGmailUsername;
	private String fromGmailPassword;
	private String emailRecipient;
	
	private String successRegex;
	private String failureRegex;
	private String errorRegex;
	
	
	private List<CampQueryParam> campParameters;
			
	public int getScriptPeriodSeconds() {
		return scriptPeriodSeconds;
	}
	public void setScriptPeriodSeconds(int scriptPeriodSeconds) {
		this.scriptPeriodSeconds = scriptPeriodSeconds;
	}
	public String getFromGmailUsername() {
		return fromGmailUsername;
	}
	public void setFromGmailUsername(String fromGmailUsername) {
		this.fromGmailUsername = fromGmailUsername;
	}
	public String getFromGmailPassword() {
		return fromGmailPassword;
	}
	public void setFromGmailPassword(String fromGmailPassword) {
		this.fromGmailPassword = fromGmailPassword;
	}
	public String getEmailRecipient() {
		return emailRecipient;
	}
	public void setEmailRecipient(String emailRecipient) {
		this.emailRecipient = emailRecipient;
	}
	public List<CampQueryParam> getCampParameters() {
		return campParameters;
	}
	public void setCampParameters(List<CampQueryParam> campParameters) {
		this.campParameters = campParameters;
	}
	
	
	@JsonIgnore
	public String getSuccessRegex() {
		return successRegex;
	}
	
	public void setSuccessRegex(String successRegex) {
		this.successRegex = successRegex;
	}
	
	@JsonIgnore
	public String getFailureRegex() {
		return failureRegex;
	}
	public void setFailureRegex(String failureRegex) {
		this.failureRegex = failureRegex;
	}
	
	@JsonIgnore
	public String getErrorRegex() {
		return errorRegex;
	}
	public void setErrorRegex(String errorRegex) {
		this.errorRegex = errorRegex;
	}
	
	
	
	
}
