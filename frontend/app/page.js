"use client";

import React, { useState } from "react";

import TaskManager from "@/app/components/TaskManager";
import Reminder from "@/app/components/Reminder";
import Pomodoro from "@/app/components/Pomodoro";
import Sidebar from "@/app/components/Sidebar";
import styles from "@/app/globals-dark.module.scss"; 

export default function Home() {
  const [section, setSection] = useState("pomodoro");

  return (
    <div className={styles.appDark}>
      <div className={styles.parent}>
        <div>
          <Sidebar section={section} setSection={setSection} />
        </div>
        <div className={styles.child}>
          <main className="main-content">
            {section === "pomodoro" && <Pomodoro />}
            {section === "reminder" && <Reminder />}
            {section === "task" && <TaskManager />}
          </main>
        </div>
      </div>
    </div>
  );
}
