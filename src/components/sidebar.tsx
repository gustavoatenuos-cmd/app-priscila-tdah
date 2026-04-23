"use client";

import { Home, CheckSquare, Target, BarChart2, BookOpen, Brain } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Início" },
    { href: "/dashboard/planner", icon: CheckSquare, label: "Tarefas" },
    { href: "/dashboard/focus", icon: Target, label: "Foco" },
    { href: "/dashboard/analytics", icon: BarChart2, label: "Análises" },
    { href: "/dashboard/journal", icon: BookOpen, label: "Diário" },
    { href: "/dashboard/brain-dump", icon: Brain, label: "Descarrego" },
  ];

  return (
    <aside className="w-24 border-r border-[#E5E7EB] bg-[#F5F5F0] hidden md:flex flex-col items-center py-8 z-10 sticky top-0 h-screen transition-all">
      <nav className="flex-1 flex flex-col items-center gap-10 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 group relative">
              {isActive && (
                <div className="bg-[#64748B] w-2 h-8 rounded-r-lg absolute -left-10 transition-all"></div>
              )}
              <item.icon 
                className={`h-6 w-6 transition-colors ${isActive ? 'text-[#64748B]' : 'text-[#9CA3AF] group-hover:text-[#64748B]'}`} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
              <span className={`text-[10px] font-bold transition-colors ${isActive ? 'text-[#64748B]' : 'text-[#9CA3AF] group-hover:text-[#64748B]'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Streak Block - Mocked for now */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl flex flex-col items-center justify-center p-3 shadow-[0_4px_15_rgba(0,0,0,0.02)]">
        <span className="text-[7.5px] font-bold text-[#9CA3AF] uppercase text-center leading-tight tracking-wider">Sequência<br/>Atual</span>
        <span className="text-2xl font-black text-[#333333] font-mono mt-1">14</span>
        <span className="text-[9px] font-bold text-[#9CA3AF] uppercase">Dias</span>
      </div>
    </aside>
  );
}
