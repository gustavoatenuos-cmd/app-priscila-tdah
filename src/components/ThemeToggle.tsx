"use client";
import { useTheme } from '@/lib/useTheme';
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center gap-2 px-4 py-2 rounded-md bg-${theme}-primary text-${theme}-primary-foreground hover:bg-${theme}-secondary transition shadow-sm border border-[#E5E7EB]`}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="h-4 w-4" /> <span className="text-sm font-medium">Claro</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" /> <span className="text-sm font-medium">Escuro</span>
        </>
      )}
    </button>
  );
}
