"use client";
import { useTheme } from '@/lib/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className={`px-4 py-2 rounded-md bg-${theme}-primary text-${theme}-primary-foreground hover:bg-${theme}-secondary transition`}
    >
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
