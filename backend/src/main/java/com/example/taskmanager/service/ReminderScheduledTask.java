package com.example.taskmanager.service;

import com.example.taskmanager.model.Reminder;
import com.example.taskmanager.model.ReminderEvent;
import com.example.taskmanager.repository.ReminderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@EnableScheduling
public class ReminderScheduledTask {

    private static final Logger logger = LoggerFactory.getLogger(ReminderScheduledTask.class);

    @Autowired
    private ReminderRepository reminderRepository;

    @Autowired
    private KafkaProducerService kafkaProducerService;

    /**
     * Runs every minute to check for due reminders and publish them to Kafka
     * Cron expression: 0 * * * * * (every minute at the 0th second)
     */
    @Scheduled(cron = "0 * * * * *")
    public void checkAndPublishDueReminders() {
        logger.info("Starting scheduled task to check for due reminders...");

        try {
            // Get current time
            LocalDateTime now = LocalDateTime.now();

            // Fetch all pending reminders that are due
            List<Reminder> dueReminders = reminderRepository.findByStatusAndDateBefore("pending", now);

            if (dueReminders.isEmpty()) {
                logger.debug("No due reminders found");
                return;
            }

            logger.info("Found {} due reminders to process", dueReminders.size());

            // Process each due reminder
            for (Reminder reminder : dueReminders) {
                try {
                    // Convert Reminder to ReminderEvent
                    ReminderEvent event = convertToReminderEvent(reminder);

                    // Publish to Kafka
                    kafkaProducerService.publishReminderEvent(event);

                    logger.info("Published reminder {} to Kafka", reminder.getId());

                } catch (Exception e) {
                    logger.error("Failed to process reminder with ID: {}", reminder.getId(), e);
                }
            }

            logger.info("Scheduled task completed. Processed {} reminders", dueReminders.size());

        } catch (Exception e) {
            logger.error("Error in scheduled task for checking due reminders", e);
        }
    }

    /**
     * Converts a Reminder entity to a ReminderEvent DTO
     */
    private ReminderEvent convertToReminderEvent(Reminder reminder) {
        ReminderEvent event = new ReminderEvent();
        event.setReminderId(reminder.getId());
        event.setTaskId(reminder.getTaskId());
        event.setUserId(reminder.getUserId());
        event.setTaskTitle(reminder.getTitle());
        event.setReminderType(reminder.getReminderType());
        event.setDueDate(reminder.getDate());
        event.setUserEmail(reminder.getUserEmail());
        event.setStatus(reminder.getStatus());
        return event;
    }
}
