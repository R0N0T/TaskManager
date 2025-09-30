import React from "react";
import styles from "./Sidebar.module.scss";

const Sidebar = ({ section, setSection }) => (
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
      <span>Productivity Suite</span>
    </div>
  </aside>
);

export default Sidebar;
