import { useEffect, useState, useCallback } from 'react';

export type BlogTheme = 'dark' | 'light';

const STORAGE_KEY = 'blog-theme';

const getInitial = (): BlogTheme => {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'light' ? 'light' : 'dark';
};

export const useBlogTheme = () => {
  const [theme, setTheme] = useState<BlogTheme>(getInitial);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, theme);
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
        setTheme(e.newValue);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, setTheme, toggle, isDark: theme === 'dark' };
};
