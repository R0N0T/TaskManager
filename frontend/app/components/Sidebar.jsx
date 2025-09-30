"use client";
import React from "react";
import styles from "./Sidebar.module.scss";
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ section, setSection }) => {
  const { logout, username } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
  <aside className={styles.sidebar}>
    <h1 className={styles.logo}>Task Suite</h1>
    <nav className={styles.sidebarNav}>
      <button
        className={
          (styles.sidebarBtn + ' ' + (section === "pomodoro" ? styles.activeBtn : "")).trim()
        }
        onClick={() => setSection("pomodoro")}
      >
        Pomodoro
      </button>
      <button
        className={
          (styles.sidebarBtn + ' ' + (section === "reminder" ? styles.activeBtn : "")).trim()
        }
        onClick={() => setSection("reminder")}
      >
        Reminders
      </button>
      <button
        className={
          (styles.sidebarBtn + ' ' + (section === "task" ? styles.activeBtn : "")).trim()
        }
        onClick={() => setSection("task")}
      >
        Task Manager
      </button>
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
