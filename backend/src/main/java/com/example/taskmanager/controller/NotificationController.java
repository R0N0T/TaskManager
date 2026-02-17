package com.example.taskmanager.controller;

import com.example.taskmanager.model.Notification;
import com.example.taskmanager.service.WebSocketNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private WebSocketNotificationService notificationService;

    /**
     * Get recent notifications (last 24h) for a user.
     * Usage: GET /notifications?userId=1
     */
    @GetMapping
    public List<Notification> getRecentNotifications(@RequestParam Long userId) {
        return notificationService.getRecentNotifications(userId);
    }

    /**
     * Get all notifications (recent + archived).
     * Usage: GET /notifications/all?userId=1
     */
    @GetMapping("/all")
    public List<Notification> getAllNotifications(@RequestParam Long userId) {
        return notificationService.getAllNotifications(userId);
    }

    /**
     * Get unread notification count.
     * Usage: GET /notifications/unread-count?userId=1
     */
    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount(@RequestParam Long userId) {
        long count = notificationService.getUnreadCount(userId);
        return Map.of("count", count);
    }

    /**
     * Mark a single notification as read.
     * Usage: PUT /notifications/123/read
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    /**
     * Mark all notifications for a user as read.
     * Usage: PUT /notifications/read-all?userId=1
     */
    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(@RequestParam Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }
}
