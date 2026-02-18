"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'relative',
        width: '2.5rem',
        height: '2.5rem',
        borderRadius: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        border: '1px solid hsl(var(--border))',
        cursor: 'pointer',
        color: 'hsl(var(--foreground))',
        overflow: 'hidden'
      }}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{
          scale: theme === "dark" ? 0 : 1,
          rotate: theme === "dark" ? 90 : 0
        }}
        transition={{ duration: 0.2 }}
        style={{ position: 'absolute' }}
      >
        <Sun size={20} />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          scale: theme === "dark" ? 1 : 0,
          rotate: theme === "dark" ? 0 : -90
        }}
        transition={{ duration: 0.2 }}
        style={{ position: 'absolute' }}
      >
        <Moon size={20} />
      </motion.div>
    </button>
  );
}
