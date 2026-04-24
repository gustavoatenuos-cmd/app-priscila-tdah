"use client";

import { Home, CheckSquare, Target, Zap, Brain } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Início" },
    { href: "/dashboard/planner", icon: CheckSquare, label: "Tarefas" },
    { href: "/dashboard/focus", icon: Target, label: "Foco" },
    { href: "/dashboard/brain-dump", icon: Brain, label: "Mente" },
    { href: "/dashboard/sos", icon: Zap, label: "SOS", isSos: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/80 backdrop-blur-xl border-t border-[#E5E7EB] px-4 pb-6 pt-3 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className="flex flex-col items-center gap-1 relative group py-2 px-3"
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#64748B]/5 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <item.icon
                className={`h-6 w-6 transition-all duration-300 ${
                  isActive 
                    ? item.isSos ? 'text-red-500 scale-110' : 'text-[#64748B] scale-110' 
                    : 'text-[#9CA3AF]'
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              
              <span className={`text-[10px] font-bold transition-colors ${
                isActive ? 'text-[#64748B]' : 'text-[#9CA3AF]'
              }`}>
                {item.label}
              </span>

              {item.isSos && !isActive && (
                 <div className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-ping" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
