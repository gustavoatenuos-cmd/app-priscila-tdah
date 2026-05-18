"use client";

import { Home, BookOpen, CheckSquare, Wind, Brain } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function MobileNav() {
  const pathname = usePathname();

  // 5 itens — espelhando a sidebar
  const navItems = [
    { href: "/dashboard", icon: Home, label: "Início" },
    { href: "/dashboard/presenca-365", icon: BookOpen, label: "365 Dias" },
    { href: "/dashboard/planner", icon: CheckSquare, label: "Meu Dia" },
    { href: "/dashboard/presenca", icon: Wind, label: "Presença" },
    { href: "/dashboard/cerebro", icon: Brain, label: "Cérebro" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 backdrop-blur-xl border-t border-[#E5E7EB] px-2 pb-6 pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 relative py-2 px-2 min-w-[56px]"
            >
              {isActive && (
                <motion.div
                  layoutId="mobileActiveTab"
                  className="absolute -top-2 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-[#84A59D] rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}

              <item.icon
                className={`h-5 w-5 transition-all duration-200 ${
                  isActive ? "text-[#1F2937]" : "text-[#9CA3AF]"
                }`}
                strokeWidth={isActive ? 2.2 : 1.8}
              />

              <span
                className={`text-[10px] font-semibold transition-colors ${
                  isActive ? "text-[#1F2937]" : "text-[#9CA3AF]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
