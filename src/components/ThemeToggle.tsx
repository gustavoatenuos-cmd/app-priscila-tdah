"use client";
import { useTheme } from '@/lib/useTheme';
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition shadow-sm border ${
        theme === 'dark' 
          ? 'bg-[#1F2937] text-white border-[#374151] hover:bg-black' 
          : 'bg-white text-[#1F2937] border-[#E5E7EB] hover:bg-[#F5F5F0]'
      }`}
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
