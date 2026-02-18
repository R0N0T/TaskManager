"use client";
import React, { useState, useEffect } from 'react';
import { Moon, Sun, Bell, Shield, Trash2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import PageContainer from '@/app/components/layout/PageContainer';
import PageHeader from '@/app/components/layout/PageHeader';
import styles from './settings.module.scss';

export default function SettingsPage() {
    const [notifications, setNotifications] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(false);
    
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <PageContainer><div className={styles.container}>Loading settings...</div></PageContainer>;
    }

    return (
        <PageContainer>
            <PageHeader 
                title="Settings" 
                description="Manage your application preferences."
            />

            <div className={styles.container}>
                
                {/* Appearance Section */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>
                            <Moon size={20} /> Appearance
                        </h2>
                    </div>
                    <div className={styles.sectionBody}>
                        <div className={styles.row}>
                            <div className={styles.info}>
                                <h3>Theme Mode</h3>
                                <p>Select your interface theme.</p>
                            </div>
                            <div className={styles.themeToggle}>
                                <button 
                                    onClick={() => setTheme('light')}
                                    className={`${styles.themeBtn} ${theme === 'light' ? styles.active : ''}`}
                                >
                                    <Sun size={16} /> Light
                                </button>
                                <button 
                                    onClick={() => setTheme('dark')}
                                    className={`${styles.themeBtn} ${theme === 'dark' ? styles.active : ''}`}
                                >
                                    <Moon size={16} /> Dark
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Notifications Section */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>
                            <Bell size={20} /> Notifications
                        </h2>
                    </div>
                    <div className={styles.sectionBody}>
                        <div className={styles.row}>
                            <div className={styles.info}>
                                <h3>Push Notifications</h3>
                                <p>Receive alerts about tasks and reminders.</p>
                            </div>
                            <label className={`${styles.toggleSwitch} ${notifications ? styles.on : ''}`}>
                                <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
                                <span />
                            </label>
                        </div>
                        
                        <div className={styles.divider} />

                        <div className={styles.row}>
                            <div className={styles.info}>
                                <h3>Email Digest</h3>
                                <p>Get a daily summary of your tasks.</p>
                            </div>
                            <label className={`${styles.toggleSwitch} ${emailAlerts ? styles.on : ''}`}>
                                <input type="checkbox" checked={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} />
                                <span />
                            </label>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className={styles.dangerSection}>
                    <div className={styles.sectionHeader}>
                        <h2>
                            <Shield size={20} /> Danger Zone
                        </h2>
                    </div>
                    <div className={styles.sectionBody}>
                        <div className={styles.row}>
                            <div className={styles.info}>
                                <h3>Delete Account</h3>
                                <p>Permanently remove your account and all data.</p>
                            </div>
                            <button 
                                onClick={() => alert("This action is not yet implemented.")}
                                className={styles.deleteBtn}
                            >
                                <Trash2 size={16} /> Delete Account
                            </button>
                        </div>
                    </div>
                </section>

            </div>
        </PageContainer>
    );
}
