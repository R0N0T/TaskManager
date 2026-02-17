package com.example.taskmanager.service;

import com.example.taskmanager.model.Notification;
import com.example.taskmanager.model.Reminder;
import com.example.taskmanager.model.ReminderEvent;
import com.example.taskmanager.repository.NotificationRepository;
import com.example.taskmanager.repository.ReminderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class WebSocketNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketNotificationService.class);

    @Autowired
    private WebPushService webPushService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ReminderRepository reminderRepository;

    /**
     * Creates a notification from a ReminderEvent, saves it to DB,
     * and pushes it to the user via WebSocket.
     */
    public void sendNotification(ReminderEvent reminderEvent) {
        Notification notification = new Notification();
        notification.setUserId(reminderEvent.getUserId());
        notification.setTitle("Reminder: " + reminderEvent.getTaskTitle());
        notification.setMessage("Your task \"" + reminderEvent.getTaskTitle() + "\" is due now.");
        notification.setType("reminder");
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        Notification saved = notificationRepository.save(notification);

        String destination = "/topic/notifications/" + reminderEvent.getUserId();
        messagingTemplate.convertAndSend(destination, saved);

        // Also send as browser push notification
        try {
            webPushService.sendPushNotification(
                    reminderEvent.getUserId(),
                    saved.getTitle(),
                    saved.getMessage());
        } catch (Exception e) {
            logger.error("Failed to send web push notification", e);
        }
    }

    /**
     * Get recent notifications (last 24 hours) for a user.
     */
    public List<Notification> getRecentNotifications(Long userId) {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(24);
        return notificationRepository.findByUserIdAndCreatedAtAfterOrderByCreatedAtDesc(userId, cutoff);
    }

    /**
     * Get all notifications for a user (recent + archived),
     * including past "sent" reminders that may not have a notification entry.
     */
    public List<Notification> getAllNotifications(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<Reminder> sentReminders = reminderRepository.findByUserIdAndStatus(userId, "sent");

        for (Reminder r : sentReminders) {
            boolean exists = notifications.stream()
                    .anyMatch(n -> n.getMessage().contains(r.getTitle()) &&
                            ChronoUnit.MINUTES.between(n.getCreatedAt(), r.getDate()) < 5);

            if (!exists) {
                Notification n = new Notification();
                n.setId(r.getId() * 10000);
                n.setUserId(userId);
                n.setTitle("Reminder: " + r.getTitle());
                n.setMessage("Past reminder: " + r.getTitle());
                n.setType("reminder");
                n.setRead(true);
                n.setCreatedAt(r.getDate());
                notifications.add(n);
            }
        }

        notifications.sort((n1, n2) -> n2.getCreatedAt().compareTo(n1.getCreatedAt()));
        return notifications;
    }

    /**
     * Get unread notification count for a user.
     */
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    /**
     * Mark a single notification as read.
     */
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + notificationId));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    /**
     * Mark all notifications for a user as read.
     */
    public void markAllAsRead(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }
}
