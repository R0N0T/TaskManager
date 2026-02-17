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
    private WebSocketNotificationService webSocketNotificationService;

    @Autowired
    private ReminderNotificationService reminderNotificationService;

    /**
     * Runs every minute to check for due reminders.
     */
    @Scheduled(cron = "0 * * * * *")
    public void checkAndPublishDueReminders() {
        try {
            LocalDateTime now = LocalDateTime.now();
            List<Reminder> dueReminders = reminderRepository.findByStatusAndDateBefore("pending", now);

            if (dueReminders.isEmpty())
                return;

            for (Reminder reminder : dueReminders) {
                try {
                    // Send notification
                    ReminderEvent event = convertToReminderEvent(reminder);
                    webSocketNotificationService.sendNotification(event);

                    // Handle Recurring vs One-time
                    if (Boolean.TRUE.equals(reminder.getRecurring()) && reminder.getDaysOfWeek() != null
                            && !reminder.getDaysOfWeek().isEmpty()) {
                        handleRecurringReschedule(reminder);
                    } else {
                        // Mark as sent
                        reminderNotificationService.updateReminderStatus(reminder.getId(), "sent");
                    }

                } catch (Exception e) {
                    logger.error("Failed to process reminder {}", reminder.getId(), e);
                    try {
                        reminderNotificationService.updateReminderStatus(reminder.getId(), "failed");
                    } catch (Exception ignored) {
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Error in scheduled task", e);
        }
    }

    private void handleRecurringReschedule(Reminder reminder) {
        try {
            LocalDateTime nextDate = calculateNextOccurrence(reminder.getDate(), reminder.getDaysOfWeek());
            reminder.setDate(nextDate);
            reminder.setStatus("pending");
            reminderRepository.save(reminder);

        } catch (Exception e) {
            logger.error("Failed to reschedule reminder {}", reminder.getId(), e);
            reminder.setStatus("failed");
            reminderRepository.save(reminder);
        }
    }

    private LocalDateTime calculateNextOccurrence(LocalDateTime current, String daysOfWeekStr) {
        // Parse days: "MON,TUE,WED"
        java.util.Set<java.time.DayOfWeek> selectedDays = new java.util.HashSet<>();
        for (String day : daysOfWeekStr.split(",")) {
            try {
                // Map "MON" -> MONDAY
                String normalized = day.trim().toUpperCase();
                // Handle 3-letter (MON) or full (MONDAY)
                if (normalized.length() == 3) {
                    // Start of day
                    // Simple mapping or iterate enum
                    for (java.time.DayOfWeek d : java.time.DayOfWeek.values()) {
                        if (d.name().startsWith(normalized)) {
                            selectedDays.add(d);
                            break;
                        }
                    }
                } else {
                    selectedDays.add(java.time.DayOfWeek.valueOf(normalized));
                }
            } catch (Exception ignored) {
            }
        }

        if (selectedDays.isEmpty())
            return current.plusDays(1); // Fallback

        LocalDateTime next = current;
        // Search for next occurrence within next 8 days
        for (int i = 1; i <= 8; i++) {
            next = next.plusDays(1);
            if (selectedDays.contains(next.getDayOfWeek())) {
                return next;
            }
        }
        return current.plusDays(1); // Fallback
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
