package com.example.taskmanager.controller;

import com.example.taskmanager.service.WebPushService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/push")
public class PushController {

    @Autowired
    private WebPushService webPushService;

    /**
     * Returns the VAPID public key for frontend push subscription.
     * This endpoint is public (no auth required).
     */
    @GetMapping("/vapid-key")
    public ResponseEntity<Map<String, String>> getVapidKey() {
        String key = webPushService.getPublicKey();
        if (key == null || key.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(Map.of("publicKey", key));
    }

    /**
     * Subscribe a browser for push notifications.
     * Expects: { userId, endpoint, keys: { p256dh, auth } }
     */
    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody Map<String, Object> body) {
        try {
            Long userId = Long.valueOf(body.get("userId").toString());
            String endpoint = (String) body.get("endpoint");

            @SuppressWarnings("unchecked")
            Map<String, String> keys = (Map<String, String>) body.get("keys");
            String p256dh = keys.get("p256dh");
            String auth = keys.get("auth");

            webPushService.subscribe(userId, endpoint, p256dh, auth);
            return ResponseEntity.ok(Map.of("status", "subscribed"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Unsubscribe a browser from push notifications.
     * Expects: { endpoint }
     */
    @PostMapping("/unsubscribe")
    public ResponseEntity<?> unsubscribe(@RequestBody Map<String, String> body) {
        String endpoint = body.get("endpoint");
        if (endpoint == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "endpoint is required"));
        }
        webPushService.unsubscribe(endpoint);
        return ResponseEntity.ok(Map.of("status", "unsubscribed"));
    }
}
