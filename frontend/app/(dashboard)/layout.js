"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from "@/app/components/Sidebar";
import NotificationPanel from "@/app/components/NotificationPanel";
import ProfileDropdown from "@/app/components/profile/ProfileDropdown";
import { ThemeToggle } from "@/app/components/ui/ThemeToggle";
import styles from "./layout.module.scss";
import { Home } from "lucide-react";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [section, setSection] = useState("home");

  useEffect(() => {
    const pathSegment = pathname?.split('/')[1] || 'home';
    setSection(pathSegment);
  }, [pathname]);

  return (
    <div className={styles.app}>
      <div className={styles.parent}>
        <Sidebar />
        <div className={styles.child}>
          <header className={styles.header}>
            <div className={styles.mobileLogo}>
              <div className={styles.logoIcon}>
                <Home size={18} />
              </div>
              <span>Task Suite</span>
            </div>
            
            <div className={styles.headerContent}>
              <NotificationPanel />
              <ProfileDropdown />
            </div>
          </header>
          <main className={styles.main}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
