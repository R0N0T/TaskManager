"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './NotificationPanel.module.scss';
import { useNotifications } from '../context/NotificationContext';
import { Bell, Check, CheckCheck, Clock } from 'lucide-react';

function timeAgo(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationPanel() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef(null);

    // Close panel on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div className={styles.wrapper} ref={panelRef}>
            <button
                className={styles.bellButton}
                onClick={() => setIsOpen(prev => !prev)}
                aria-label="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className={styles.badge}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                className={styles.markAllBtn}
                                onClick={() => markAllAsRead()}
                            >
                                <CheckCheck size={14} />
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className={styles.panelBody}>
                        {notifications.length === 0 ? (
                            <div className={styles.empty}>
                                <Bell size={32} strokeWidth={1} />
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={`${styles.item} ${!n.read ? styles.unread : ''}`}
                                    onClick={() => {
                                        if (!n.read) markAsRead(n.id);
                                    }}
                                >
                                    <div className={styles.itemIcon}>
                                        {n.read ? (
                                            <Check size={16} />
                                        ) : (
                                            <div className={styles.dot} />
                                        )}
                                    </div>
                                    <div className={styles.itemContent}>
                                        <p className={styles.itemTitle}>{n.title}</p>
                                        <p className={styles.itemMessage}>{n.message}</p>
                                        <span className={styles.itemTime}>
                                            <Clock size={12} />
                                            {timeAgo(n.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}

                    </div>
                    <div className={styles.panelFooter}>
                        <a href="/notifications">View all notifications</a>
                    </div>
                </div>
            )}
        </div>
    );
}
