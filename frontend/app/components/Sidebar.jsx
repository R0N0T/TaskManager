"use client";
import React from "react";
import styles from "./Sidebar.module.scss";
import { useAuth } from '../context/AuthContext';
import Link from "next/link";
import { Timer, Bell, CheckSquare, FileText, Home, Trello, User, LayoutDashboard } from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, section: "home" },
  { href: "/tasks", label: "Tasks", icon: CheckSquare, section: "tasks" },
  { href: "/kanban", label: "Kanban Board", icon: Trello, section: "kanban" },
  { href: "/reminder", label: "Reminders", icon: Bell, section: "reminder" },
  { href: "/notes", label: "Notes", icon: FileText, section: "notes" },
  { href: "/pomodoro", label: "Pomodoro", icon: Timer, section: "pomodoro" },
  { href: "/profile", label: "Profile", icon: User, section: "profile" },
];

const Sidebar = ({ section }) => {
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
    </aside>
  );
};

export default Sidebar;

