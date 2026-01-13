package com.example.taskmanager.service;

import com.example.taskmanager.model.ReminderEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(EmailNotificationService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    /**
     * Sends an email notification for a reminder event
     * Currently mocks the email sending if mail sender is not available
     */
    public void sendEmailNotification(ReminderEvent reminderEvent) {
        logger.info("Processing email notification for reminder: {}", reminderEvent.getReminderId());

        try {
            String to = reminderEvent.getUserEmail();
            String subject = "Reminder: " + reminderEvent.getTaskTitle();
            String body = buildEmailBody(reminderEvent);

            // If mail sender is configured, send actual email
            if (mailSender != null) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(to);
                message.setSubject(subject);
                message.setText(body);
                message.setFrom("noreply@taskmanager.com");

                mailSender.send(message);
                logger.info("Email sent successfully to: {}", to);
            } else {
                // Mock email sending
                logger.info("MOCK: Email notification would be sent to: {}", to);
                logger.info("MOCK: Subject: {}", subject);
                logger.info("MOCK: Body:\n{}", body);
            }

        } catch (Exception e) {
            logger.error("Failed to send email notification for reminder: {}", reminderEvent.getReminderId(), e);
            throw new RuntimeException("Failed to send email notification", e);
        }
    }

    /**
     * Builds the email body for a reminder event
     */
    private String buildEmailBody(ReminderEvent reminderEvent) {
        return String.format(
                "Hello,\n\n" +
                        "This is a reminder for your task:\n\n" +
                        "Task: %s\n" +
                        "Due Date: %s\n" +
                        "Description: Reminder ID - %d\n\n" +
                        "Please check your task manager for more details.\n\n" +
                        "Best regards,\n" +
                        "Task Manager Team",
                reminderEvent.getTaskTitle(),
                reminderEvent.getDueDate(),
                reminderEvent.getReminderId()
        );
    }
}
