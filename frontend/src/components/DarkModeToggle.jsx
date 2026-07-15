import { useEffect, useState } from 'react';

const DARK_KEY = 'heritagex-theme';

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem(DARK_KEY);
    return stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem(DARK_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  return [isDark, setIsDark];
}

export default function DarkModeToggle({ isDark, onToggle }) {
  return (
    <button
      type="button"
      className="dark-mode-toggle"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? '☀️' : '🌙'}
      <span>{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
