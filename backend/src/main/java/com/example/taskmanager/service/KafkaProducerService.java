package com.example.taskmanager.service;

import com.example.taskmanager.model.ReminderEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

    private static final Logger logger = LoggerFactory.getLogger(KafkaProducerService.class);
    private static final String TOPIC = "reminders";

    @Autowired
    private KafkaTemplate<String, ReminderEvent> kafkaTemplate;

    /**
     * Publishes a reminder event to the Kafka "reminders" topic
     */
    public void publishReminderEvent(ReminderEvent reminderEvent) {
        logger.info("Publishing reminder event to Kafka topic '{}': {}", TOPIC, reminderEvent);
        
        try {
            Message<ReminderEvent> message = MessageBuilder
                    .withPayload(reminderEvent)
                    .setHeader(KafkaHeaders.TOPIC, TOPIC)
                    .build();

            kafkaTemplate.send(message);
            
            logger.info("Successfully published reminder event with ID: {}", reminderEvent.getReminderId());
        } catch (Exception e) {
            logger.error("Failed to publish reminder event with ID: {}", reminderEvent.getReminderId(), e);
            throw new RuntimeException("Failed to publish reminder event", e);
        }
    }

    /**
     * Publishes a reminder event with explicit topic override
     */
    public void publishReminderEvent(String topic, ReminderEvent reminderEvent) {
        logger.info("Publishing reminder event to Kafka topic '{}': {}", topic, reminderEvent);
        
        try {
            Message<ReminderEvent> message = MessageBuilder
                    .withPayload(reminderEvent)
                    .setHeader(KafkaHeaders.TOPIC, topic)
                    .build();

            kafkaTemplate.send(message);
            
            logger.info("Successfully published reminder event with ID: {}", reminderEvent.getReminderId());
        } catch (Exception e) {
            logger.error("Failed to publish reminder event with ID: {}", reminderEvent.getReminderId(), e);
            throw new RuntimeException("Failed to publish reminder event", e);
        }
    }
}
