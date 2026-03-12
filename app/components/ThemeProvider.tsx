'use client';

import { useEffect, useState } from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
  onThemeChange?: (isDark: boolean) => void;
}

export default function ThemeProvider({ children, onThemeChange }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
    setMounted(true);
  }, []);

  // Sync dark class with isDark state
  useEffect(() => {
    if (!mounted) return;

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(isDark));
    onThemeChange?.(isDark);
  }, [isDark, mounted, onThemeChange]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <div data-theme={isDark ? 'dark' : 'light'}>
      {typeof children === 'function' ? children({ isDark, toggleTheme }) : children}
    </div>
  );
}
