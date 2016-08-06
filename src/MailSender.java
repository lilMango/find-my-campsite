import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

public class MailSender {
	private static String GMAIL_USERNAME = "INSERT_EMAIL_HERE";
	private static String GMAIL_PASSWORD = "INSERT_EMAIL_PASS HERE";
	private static String RECIPIENT = "INSERT_RECIPEIENT EMAIL HERE";
	
	private static MailSender instance = null;	
	
	protected MailSender() {
		
	}
		
	public static MailSender getInstance() {
		if(instance!=null) {
			return instance;
		}else {
			return new MailSender();
		}
	}
	
	public boolean sendMessage(String messageBody) {
        Properties props = new Properties();
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");

        Session session = Session.getInstance(props,
          new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(GMAIL_USERNAME, GMAIL_PASSWORD);
            }
          });

        try {

            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(GMAIL_USERNAME));
            message.setRecipients(Message.RecipientType.TO,
                InternetAddress.parse(RECIPIENT));
            message.setSubject("A Campsite just opened up!");
            message.setText(messageBody);

            Transport.send(message);

            return true;

        } catch (MessagingException e) {
        	//return false;
            throw new RuntimeException(e);
        }
        
        
	}
}
