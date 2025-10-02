"use client";

import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import Sidebar from "@/app/components/Sidebar";
import styles from "@/app/globals-dark.module.scss";

export default function AppLayout({ children }) {
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
          <Sidebar section={window.location.pathname.split('/')[1] || 'home'} />
        </div>
        <div className={styles.child}>
          <main className="main-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}