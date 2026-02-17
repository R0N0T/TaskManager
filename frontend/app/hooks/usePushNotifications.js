"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Custom hook for managing Web Push notification subscriptions.
 * Registers service worker, requests permission, subscribes with VAPID key.
 */
export function usePushNotifications() {
    const [isSupported, setIsSupported] = useState(false);
    const [permission, setPermission] = useState('default');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const swRegistrationRef = useRef(null);

    // Check browser support on mount
    useEffect(() => {
        const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
        setIsSupported(supported);

        if (supported) {
            setPermission(Notification.permission);
        }
    }, []);

    /**
     * Register the service worker and check existing subscription.
     */
    const registerServiceWorker = useCallback(async () => {
        if (!isSupported) return null;

        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            swRegistrationRef.current = registration;

            // Check if already subscribed
            const existingSub = await registration.pushManager.getSubscription();
            setIsSubscribed(!!existingSub);

            return registration;
        } catch (err) {
            console.error('Service worker registration failed:', err);
            return null;
        }
    }, [isSupported]);

    /**
     * Subscribe to push notifications.
     * Requests permission, gets VAPID key from backend, subscribes, and sends subscription to backend.
     */
    const subscribe = useCallback(async (userId) => {
        if (!isSupported || !userId) return false;

        try {
            // Request notification permission
            const perm = await Notification.requestPermission();
            setPermission(perm);

            if (perm !== 'granted') {
                return false;
            }

            // Get or register service worker
            let registration = swRegistrationRef.current;
            if (!registration) {
                registration = await registerServiceWorker();
            }
            if (!registration) return false;

            // Fetch VAPID public key from backend
            const vapidResponse = await fetch(`${API_BASE}/push/vapid-key`);
            if (!vapidResponse.ok || vapidResponse.status === 204) {
                console.error('VAPID key not configured on server');
                return false;
            }
            const { publicKey } = await vapidResponse.json();

            // Convert VAPID key to Uint8Array
            const applicationServerKey = urlBase64ToUint8Array(publicKey);

            // Subscribe to push
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey
            });

            // Send subscription to backend
            const subJson = subscription.toJSON();
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_BASE}/push/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    userId,
                    endpoint: subJson.endpoint,
                    keys: {
                        p256dh: subJson.keys.p256dh,
                        auth: subJson.keys.auth
                    }
                })
            });

            if (response.ok) {
                setIsSubscribed(true);
                return true;
            }
            return false;
        } catch (err) {
            console.error('Push subscription failed:', err);
            return false;
        }
    }, [isSupported, registerServiceWorker]);

    /**
     * Unsubscribe from push notifications.
     */
    const unsubscribe = useCallback(async () => {
        try {
            const registration = swRegistrationRef.current || await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                const endpoint = subscription.endpoint;
                await subscription.unsubscribe();

                // Tell backend
                const token = localStorage.getItem('token');
                await fetch(`${API_BASE}/push/unsubscribe`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ endpoint })
                });
            }

            setIsSubscribed(false);
        } catch (err) {
            console.error('Push unsubscribe failed:', err);
        }
    }, []);

    return {
        isSupported,
        permission,
        isSubscribed,
        subscribe,
        unsubscribe,
        registerServiceWorker
    };
}

/**
 * Convert a base64 URL-encoded string to a Uint8Array.
 * Required for applicationServerKey in PushManager.subscribe().
 */
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
