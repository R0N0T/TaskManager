"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from "@/app/components/Sidebar";
import styles from "@/app/globals-dark.module.scss";

export default function AppLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [section, setSection] = useState("home");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const pathSegment = pathname?.split('/')[1] || 'home';
    setSection(pathSegment);
  }, [pathname]);

  return (
    <div className={styles.appDark}>
      <div className={styles.parent}>
        <div>
          <Sidebar section={section} />
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