"use client";
import React from "react";
import styles from "./Sidebar.module.scss";
import { useAuth } from '../context/AuthContext';
import Link from "next/link";
import { Timer, Bell, CheckSquare, FileText, Home, LogOut, User } from "lucide-react";

const navItems = [
  { href: "/tasks", label: "Tasks", icon: CheckSquare, section: "task" },
  { href: "/notes", label: "Notes", icon: FileText, section: "notes" },
  { href: "/pomodoro", label: "Pomodoro", icon: Timer, section: "pomodoro" },
  { href: "/reminder", label: "Reminders", icon: Bell, section: "reminder" },
];

const Sidebar = ({ section }) => {
  const { logout, username } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.logo}>
        <div className={styles.logoIcon}>
          <Home size={20} />
        </div>
        <span className={styles.logoText}>Task Suite</span>
      </Link>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${section === item.section ? styles.active : ""}`}
          >
            <item.icon size={18} strokeWidth={1.8} />
            <span className={styles.navLabel}>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userCard}>
          <div className={styles.avatar}>
            <User size={16} />
          </div>
          <span className={styles.username}>{username || 'User'}</span>
        </div>
        <button onClick={logout} className={styles.logoutBtn}>
          <LogOut size={16} />
          <span className={styles.logoutText}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
