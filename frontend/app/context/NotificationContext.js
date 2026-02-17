"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { apiClient } from '../utils/apiClient';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { usePushNotifications } from '../hooks/usePushNotifications';

const NotificationContext = createContext({
    notifications: [],
    unreadCount: 0,
    markAsRead: () => {},
    markAllAsRead: () => {},
    latestNotification: null,
});

export function NotificationProvider({ children }) {
    const { isAuthenticated, userId } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [latestNotification, setLatestNotification] = useState(null);
    const stompClientRef = useRef(null);
    const { subscribe: subscribePush, registerServiceWorker } = usePushNotifications();

    // Fetch existing notifications from REST API
    const fetchNotifications = useCallback(async () => {
        if (!userId) return;
        try {
            const data = await apiClient.get(`/notifications?userId=${userId}`);
            setNotifications(data || []);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    }, [userId]);

    const fetchUnreadCount = useCallback(async () => {
        if (!userId) return;
        try {
            const data = await apiClient.get(`/notifications/unread-count?userId=${userId}`);
            setUnreadCount(data?.count || 0);
        } catch (err) {
            console.error('Failed to fetch unread count:', err);
        }
    }, [userId]);

    // Connect to WebSocket when authenticated
    useEffect(() => {
        if (!isAuthenticated || !userId) return;

        // Fetch initial data
        fetchNotifications();
        fetchUnreadCount();

        // Set up STOMP over SockJS
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            debug: () => {},
        });

        stompClient.onConnect = () => {
            // Auto-subscribe to push notifications
            subscribePush(userId);

            // Subscribe to user-specific topic
            stompClient.subscribe(`/topic/notifications/${userId}`, (message) => {
                try {
                    const notification = JSON.parse(message.body);


                    // Play sound
                    try {
                        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                        audio.play().catch(e => console.error('Audio play failed:', e));
                    } catch (e) {
                        console.error('Audio error:', e);
                    }

                    // Add to state
                    setNotifications(prev => [notification, ...prev]);
                    setUnreadCount(prev => prev + 1);
                    setLatestNotification(notification);

                    // Clear latest after toast duration
                    setTimeout(() => setLatestNotification(null), 120000);
                } catch (err) {
                    console.error('Failed to parse notification:', err);
                }
            });
        };

        stompClient.onStompError = (frame) => {
            console.error('STOMP error:', frame.headers?.message);
        };

        stompClient.activate();
        stompClientRef.current = stompClient;

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }
        };
    }, [isAuthenticated, userId, fetchNotifications, fetchUnreadCount]);

    const markAsRead = useCallback(async (notificationId) => {
        try {
            await apiClient.put(`/notifications/${notificationId}/read`);
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        if (!userId) return;
        try {
            await apiClient.put(`/notifications/read-all?userId=${userId}`);
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    }, [userId]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            markAsRead,
            markAllAsRead,
            latestNotification,
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => useContext(NotificationContext);
