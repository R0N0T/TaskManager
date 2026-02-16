"use client";

import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';
import Sidebar from "@/app/components/Sidebar";
import styles from "@/app/globals-dark.module.scss";
import welcomeStyles from "@/app/welcome.module.css";
import { CheckSquare, FileText, Timer, Bell } from "lucide-react";

const features = [
  { icon: CheckSquare, title: "Task Manager", desc: "Track habits with calendar completions", href: "/tasks" },
  { icon: FileText, title: "Notes", desc: "Capture and organize your thoughts", href: "/notes" },
  { icon: Timer, title: "Pomodoro", desc: "Focus timer with work/break cycles", href: "/pomodoro" },
  { icon: Bell, title: "Reminders", desc: "Never miss an important deadline", href: "/reminder" },
];

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className={styles.appDark}>
      <div className={styles.parent}>
        <div>
          <Sidebar section="home" />
        </div>
        <div className={styles.child}>
          <main>
            <div className={welcomeStyles.welcomeContainer}>
              <div className={welcomeStyles.welcomeGlow} />
              <h1 className={welcomeStyles.heading}>
                Welcome to <span className={welcomeStyles.gradient}>Task Suite</span>
              </h1>
              <p className={welcomeStyles.subtitle}>
                Your all-in-one productivity workspace
              </p>
              <div className={welcomeStyles.featureGrid}>
                {features.map((feat) => (
                  <a key={feat.title} href={feat.href} className={welcomeStyles.featureCard}>
                    <div className={welcomeStyles.featureIcon}>
                      <feat.icon size={22} />
                    </div>
                    <h3>{feat.title}</h3>
                    <p>{feat.desc}</p>
                  </a>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
