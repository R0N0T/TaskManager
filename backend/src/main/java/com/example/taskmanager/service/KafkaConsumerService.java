package com.example.taskmanager.service;

import com.example.taskmanager.model.ReminderEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    private static final Logger logger = LoggerFactory.getLogger(KafkaConsumerService.class);

    @Autowired
    private WebSocketNotificationService webSocketNotificationService;

    @Autowired
    private ReminderNotificationService reminderNotificationService;

    /**
     * Listens to the "reminders" topic.
     * Consumer group: "notification-service"
     * All reminder events are now routed to WebSocket in-app notifications.
     */
    @KafkaListener(topics = "reminders", groupId = "notification-service", containerFactory = "kafkaListenerContainerFactory")
    public void consumeReminderEvent(ReminderEvent reminderEvent) {
        logger.info("Received reminder event from Kafka: {}", reminderEvent.getReminderId());

        try {
            if (reminderEvent == null || reminderEvent.getReminderId() == null) {
                logger.error("Invalid reminder event received");
                return;
            }

            // Send in-app notification via WebSocket
            webSocketNotificationService.sendNotification(reminderEvent);

            // Update reminder status to "sent"
            reminderNotificationService.updateReminderStatus(reminderEvent.getReminderId(), "sent");
            logger.info("Successfully processed reminder event: {}", reminderEvent.getReminderId());

        } catch (Exception e) {
            logger.error("Error processing reminder event with ID: {}", reminderEvent.getReminderId(), e);
            try {
                reminderNotificationService.updateReminderStatus(reminderEvent.getReminderId(), "failed");
            } catch (Exception statusUpdateError) {
                logger.error("Failed to update reminder status to 'failed'", statusUpdateError);
            }
        }
    }
}
