"use client";
import React, { useState } from "react";
import styles from "./Sidebar.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Timer, Bell, CheckSquare, FileText, Home, Trello, User, 
  LayoutDashboard, Settings, ChevronLeft, ChevronRight 
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/kanban", label: "Kanban Board", icon: Trello },
  { href: "/reminder", label: "Reminders", icon: Bell },
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/pomodoro", label: "Pomodoro", icon: Timer },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside 
      className={styles.sidebar}
      initial={{ width: 260 }}
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className={styles.header}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Home size={20} />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span 
                className={styles.logoText}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                Task Suite
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={styles.collapseBtn}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(styles.navItem, isActive && styles.active)}
            >
              <item.icon size={20} className={styles.icon} />
              {!isCollapsed && (
                <motion.span 
                  className={styles.navLabel}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {item.label}
                </motion.span>
              )}
              {isActive && (
                <motion.div 
                  className={styles.activeIndicator}
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;

