import java.io.File;
import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class ConfigLoader {
	private static ConfigLoader instance =null;
	private static Config config=null;
	
	protected ConfigLoader() {
		ObjectMapper mapper = new ObjectMapper();

		try {

			// Convert JSON string from file to Object
			config= mapper.readValue(new File("config.json"), Config.class);
			System.out.println(config);

//			// Convert JSON string to Object
//			String jsonInString = "{\"scriptPeriodMinutes\":\"120\",\"fromGmailUsername\":\"testSender@config.json\",\"fromGmailPassword\":\"pw\",\"emailRecipient\":\"yolo@gmail.com\"}";
//			Config config2= mapper.readValue(jsonInString, Config.class);
//			System.out.println(config2);

//			//Pretty print
//			String prettyConfig = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(config);
//			System.out.println(prettyConfig);

		} catch (JsonGenerationException e) {
			e.printStackTrace();
			config = createDefaultConfig();
		} catch (JsonMappingException e) {
			e.printStackTrace();
			config = createDefaultConfig();
		} catch (IOException e) {
			e.printStackTrace();
			config = createDefaultConfig();
		}
	}
	
	public static ConfigLoader getInstance() {
		if(instance!=null) {
			return instance;
		} else {
			return new ConfigLoader();
		}
	}
	
	public static Config getConfig() {
		if(instance==null) {
			instance = new ConfigLoader();
		}
		return config;
	}
	
	private static Config createDefaultConfig() {
		Config config = new Config();
		config.setScriptPeriodSeconds(900);
		config.setFromGmailUsername("default_sender@gmail.com");
		config.setFromGmailPassword("passwordPlz");	
		config.setEmailRecipient("email@yahoo.com");
	
		
		return config;
	}
	
	
}
