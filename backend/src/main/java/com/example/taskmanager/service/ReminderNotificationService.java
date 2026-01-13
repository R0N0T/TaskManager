package com.example.taskmanager.service;

import com.example.taskmanager.model.Reminder;
import com.example.taskmanager.model.ReminderEvent;
import com.example.taskmanager.repository.ReminderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReminderNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(ReminderNotificationService.class);

    @Autowired
    private ReminderRepository reminderRepository;

    /**
     * Sends an in-app notification for a reminder event
     * Currently just logs the notification
     */
    public void sendInAppNotification(ReminderEvent reminderEvent) {
        logger.info("Processing in-app notification for reminder: {}", reminderEvent.getReminderId());

        try {
            // In a real application, this could:
            // - Save to a notifications table
            // - Send a WebSocket message to the user
            // - Save to a notification service
            
            logger.info("IN-APP NOTIFICATION: Task '{}' reminder is due on {}", 
                    reminderEvent.getTaskTitle(), 
                    reminderEvent.getDueDate());
            
            logger.info("Notification sent to user: {}", reminderEvent.getUserId());

        } catch (Exception e) {
            logger.error("Failed to send in-app notification for reminder: {}", reminderEvent.getReminderId(), e);
            throw new RuntimeException("Failed to send in-app notification", e);
        }
    }

    /**
     * Updates the status of a reminder
     */
    public void updateReminderStatus(Long reminderId, String status) {
        logger.info("Updating reminder {} status to: {}", reminderId, status);

        try {
            Reminder reminder = reminderRepository.findById(reminderId)
                    .orElseThrow(() -> new RuntimeException("Reminder not found with ID: " + reminderId));

            reminder.setStatus(status);
            reminderRepository.save(reminder);

            logger.info("Successfully updated reminder {} status to: {}", reminderId, status);

        } catch (Exception e) {
            logger.error("Failed to update reminder status for ID: {}", reminderId, e);
            throw new RuntimeException("Failed to update reminder status", e);
        }
    }
}
