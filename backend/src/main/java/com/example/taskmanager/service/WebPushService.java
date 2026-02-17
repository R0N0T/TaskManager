package com.example.taskmanager.service;

import com.example.taskmanager.model.PushSubscription;
import com.example.taskmanager.repository.PushSubscriptionRepository;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.annotation.PostConstruct;
import java.security.GeneralSecurityException;
import java.security.Security;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class WebPushService {

    private static final Logger logger = LoggerFactory.getLogger(WebPushService.class);

    @Value("${webpush.vapid.public-key:}")
    private String vapidPublicKey;

    @Value("${webpush.vapid.private-key:}")
    private String vapidPrivateKey;

    @Value("${webpush.vapid.subject:mailto:noreply@taskmanager.local}")
    private String vapidSubject;

    @Autowired
    private PushSubscriptionRepository subscriptionRepository;

    private PushService pushService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostConstruct
    public void init() {
        // Register BouncyCastle provider
        if (Security.getProvider(BouncyCastleProvider.PROVIDER_NAME) == null) {
            Security.addProvider(new BouncyCastleProvider());
        }

        if (vapidPublicKey.isEmpty() || vapidPrivateKey.isEmpty()) {
            logger.warn("VAPID keys not configured. Web Push notifications are disabled. "
                    + "Generate keys and set webpush.vapid.public-key and webpush.vapid.private-key in application.properties.");
            return;
        }

        try {
            pushService = new PushService()
                    .setPublicKey(vapidPublicKey)
                    .setPrivateKey(vapidPrivateKey)
                    .setSubject(vapidSubject);
        } catch (GeneralSecurityException e) {
            logger.error("Failed to initialize Web Push service", e);
        }
    }

    /**
     * Returns the VAPID public key for frontend subscription.
     */
    public String getPublicKey() {
        return vapidPublicKey;
    }

    /**
     * Returns true if web push is properly configured.
     */
    public boolean isEnabled() {
        return pushService != null;
    }

    /**
     * Save a push subscription for a user.
     */
    public PushSubscription subscribe(Long userId, String endpoint, String p256dh, String auth) {
        // Check if this endpoint already exists
        return subscriptionRepository.findByEndpoint(endpoint)
                .map(existing -> {
                    // Update userId if different (e.g., user re-logged in)
                    existing.setUserId(userId);
                    existing.setP256dh(p256dh);
                    existing.setAuth(auth);
                    return subscriptionRepository.save(existing);
                })
                .orElseGet(() -> {
                    PushSubscription sub = new PushSubscription();
                    sub.setUserId(userId);
                    sub.setEndpoint(endpoint);
                    sub.setP256dh(p256dh);
                    sub.setAuth(auth);
                    return subscriptionRepository.save(sub);
                });
    }

    /**
     * Remove a push subscription.
     */
    public void unsubscribe(String endpoint) {
        subscriptionRepository.findByEndpoint(endpoint)
                .ifPresent(sub -> subscriptionRepository.delete(sub));
    }

    /**
     * Send a push notification to all subscriptions for a user.
     */
    public void sendPushNotification(Long userId, String title, String message) {
        if (!isEnabled()) {
            return;
        }

        List<PushSubscription> subscriptions = subscriptionRepository.findByUserId(userId);
        if (subscriptions.isEmpty()) {
            return;
        }

        try {
            Map<String, String> payload = new HashMap<>();
            payload.put("title", title);
            payload.put("body", message);
            payload.put("url", "/tasks");
            String jsonPayload = objectMapper.writeValueAsString(payload);

            for (PushSubscription sub : subscriptions) {
                try {
                    Notification notification = new Notification(
                            sub.getEndpoint(),
                            sub.getP256dh(),
                            sub.getAuth(),
                            jsonPayload.getBytes());
                    pushService.send(notification);
                } catch (Exception e) {
                    // If subscription is expired/invalid, remove it
                    if (e.getMessage() != null && (e.getMessage().contains("410") || e.getMessage().contains("404"))) {
                        subscriptionRepository.delete(sub);
                    } else {
                        logger.error("Failed to send push to endpoint: {}", sub.getEndpoint(), e);
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Error preparing push notification for user {}", userId, e);
        }
    }
}
