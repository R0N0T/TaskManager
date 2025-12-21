"use client";
import React from "react";
import styles from "./Sidebar.module.scss";
import { useAuth } from '../context/AuthContext';
import Link from "next/link";

const Sidebar = ({ section, setSection }) => {
  const { logout, username } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
  <aside className={styles.sidebar}>
    <Link href="/" className={styles.logo}>Task Suite</Link>
    <nav className={styles.sidebarNav}>
      <Link
        href="/pomodoro"
        className={`${styles.sidebarBtn} ${section === "pomodoro" ? styles.activeBtn : ""}`}
      >
        Pomodoro
      </Link>
      <Link
        href="/reminder"
        className={`${styles.sidebarBtn} ${section === "reminder" ? styles.activeBtn : ""}`}
      >
        Reminders
      </Link>
      <Link
        href="/tasks"
        className={`${styles.sidebarBtn} ${section === "task" ? styles.activeBtn : ""}`}
      >
        Task Manager
      </Link>
      <Link
        href="/notes"
        className={`${styles.sidebarBtn} ${section === "notes" ? styles.activeBtn : ""}`}
      >
        Notes
      </Link>
    </nav>
    <div className={styles.sidebarFooter}>
      <div className={styles.userInfo}>
        <span>{username || 'User'}</span>
      </div>
      <button
        onClick={handleLogout}
        className={styles.logoutButton}
      >
        Logout
      </button>
    </div>
  </aside>
  );
};

export default Sidebar;
