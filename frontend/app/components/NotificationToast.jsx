"use client";

import React, { useEffect, useState } from 'react';
import styles from './NotificationToast.module.scss';
import { useNotifications } from '../context/NotificationContext';
import { Bell, X } from 'lucide-react';

export default function NotificationToast() {
    const { latestNotification } = useNotifications();
    const [visible, setVisible] = useState(false);
    const [currentNotification, setCurrentNotification] = useState(null);

    useEffect(() => {
        if (latestNotification) {
            setCurrentNotification(latestNotification);
            setVisible(true);

            const timer = setTimeout(() => {
                setVisible(false);
            }, 4500);

            return () => clearTimeout(timer);
        }
    }, [latestNotification]);

    if (!visible || !currentNotification) return null;

    return (
        <div className={styles.toast}>
            <div className={styles.iconWrap}>
                <Bell size={18} />
            </div>
            <div className={styles.content}>
                <p className={styles.title}>{currentNotification.title}</p>
                <p className={styles.message}>{currentNotification.message}</p>
            </div>
            <button
                className={styles.closeBtn}
                onClick={() => setVisible(false)}
                aria-label="Dismiss"
            >
                <X size={14} />
            </button>
            <div className={styles.progressBar} />
        </div>
    );
}
