'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next = theme === 'light' ? 'dark' : 'light';
  const label = next === 'dark' ? 'Dark' : 'Light';
  return (
    <button
      type="button"
      title={`Switch to ${label} mode`}
      onClick={() => setTheme(next)}
      className="inline-flex items-center rounded-lg border border-brand-200/60 dark:border-brand-900/40 bg-white/80 dark:bg-brand-900/50 text-brand-900 dark:text-white px-3 py-1.5 text-sm hover:bg-white/90 dark:hover:bg-brand-800/60 focus:outline-none focus:ring-2 focus:ring-brand-400"
    >
      {label} mode
    </button>
  );
}
