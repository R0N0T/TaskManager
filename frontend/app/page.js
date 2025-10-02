"use client";

import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';
import Sidebar from "@/app/components/Sidebar";
import styles from "@/app/globals-dark.module.scss";
import welcomeStyles from "@/app/welcome.module.css"; 

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
          <main className="main-content">
            <div className={welcomeStyles.welcomeContainer}>
              <h1>Welcome to Task Suite</h1>
              <p>Select a feature from the sidebar to get started</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
