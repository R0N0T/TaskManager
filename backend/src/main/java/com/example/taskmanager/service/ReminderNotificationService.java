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
     * Updates the status of a reminder.
     */
    public void updateReminderStatus(Long reminderId, String status) {
        try {
            Reminder reminder = reminderRepository.findById(reminderId)
                    .orElseThrow(() -> new RuntimeException("Reminder not found: " + reminderId));
            reminder.setStatus(status);
            reminderRepository.save(reminder);
        } catch (Exception e) {
            logger.error("Failed to update reminder status for ID: {}", reminderId, e);
            throw new RuntimeException("Failed to update reminder status", e);
        }
    }
}
