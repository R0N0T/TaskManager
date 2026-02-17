"use client";

import React, { useState, useEffect } from 'react';
import { apiClient } from '../utils/apiClient';
import styles from './page.module.scss';
import { Bell, Check, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/notifications/all')
            .then(data => {
                setNotifications(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const timeAgo = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${date.toLocaleDateString()}`;
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/" className={styles.backLink}>
                    <ArrowLeft size={20} /> Back to Dashboard
                </Link>
                <h1>All Notifications</h1>
            </header>

            <div className={styles.list}>
                {loading ? (
                    <p>Loading...</p>
                ) : notifications.length === 0 ? (
                    <div className={styles.empty}>
                        <Bell size={48} />
                        <p>No notifications found</p>
                    </div>
                ) : (
                    notifications.map(n => (
                        <div key={n.id} className={`${styles.item} ${!n.read ? styles.unread : ''}`}>
                            <div className={styles.icon}>
                                {n.read ? <Check size={20} /> : <div className={styles.dot} />}
                            </div>
                            <div className={styles.content}>
                                <h3>{n.title}</h3>
                                <p>{n.message}</p>
                                <span className={styles.time}><Clock size={14} /> {timeAgo(n.createdAt)}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
