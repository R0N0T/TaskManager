"use client";
import React, { useState, useEffect, useRef } from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import styles from './Profile.module.scss';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../utils/apiClient';

export default function ProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const dropdownRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await apiClient.get('/api/users/me');
                setUser(data);
            } catch (error) {
                console.error("Failed to fetch user profile", error);
            }
        };
        fetchUser();

        // Click outside to close
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    const getInitials = (name) => {
        return name ? name.substring(0, 2).toUpperCase() : 'U';
    };

    return (
        <div className={styles.profileContainer} ref={dropdownRef}>
            <button className={styles.avatarBtn} onClick={() => setIsOpen(!isOpen)}>
                {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Profile" className={styles.avatarImg} />
                ) : (
                    <div className={styles.avatarPlaceholder}>
                        {getInitials(user?.username)}
                    </div>
                )}
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.header}>
                        <p className={styles.username}>{user?.username || 'Guest'}</p>
                        <p className={styles.email}>{user?.email || 'No email'}</p>
                    </div>
                    <div className={styles.menu}>
                        <button className={styles.menuItem} onClick={() => { setIsOpen(false); router.push('/profile'); }}>
                            <User size={16} /> Profile
                        </button>
                        <button className={styles.menuItem} onClick={() => { setIsOpen(false); router.push('/settings'); }}>
                            <Settings size={16} /> Settings
                        </button>
                        <div className={styles.divider}></div>
                        <button className={styles.menuItem} onClick={handleLogout}>
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
