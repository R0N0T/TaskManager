"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from "@/app/components/Sidebar";
import NotificationPanel from "@/app/components/NotificationPanel";
import ProfileDropdown from "@/app/components/profile/ProfileDropdown";
import styles from "@/app/globals-dark.module.scss";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [section, setSection] = useState("home");

  useEffect(() => {
    const pathSegment = pathname?.split('/')[1] || 'home';
    setSection(pathSegment);
  }, [pathname]);

  return (
    <div className={styles.appDark}>
      <div className={styles.parent}>
        <Sidebar section={section} />
        <div className={styles.child}>
          <header style={{ 
            position: 'sticky', 
            top: 0, 
            right: 0, 
            zIndex: 100, 
            padding: '1.5rem',
            display: 'flex', 
            justifyContent: 'flex-end',
            alignItems: 'center', 
            gap: '1rem',
            background: 'transparent',
            pointerEvents: 'none'
          }}>
            <div style={{ pointerEvents: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <NotificationPanel />
              <ProfileDropdown />
            </div>
          </header>
          <main className="main-content" style={{ padding: '0 2rem 2rem 2rem' }}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
