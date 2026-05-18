"use client";

import { Home, BookOpen, CheckSquare, Wind, Brain, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // 5 itens essenciais — seguindo a proposta de produto
  const navItems = [
    { href: "/dashboard", icon: Home, label: "Início" },
    { href: "/dashboard/presenca-365", icon: BookOpen, label: "365 Dias" },
    { href: "/dashboard/planner", icon: CheckSquare, label: "Meu Dia" },
    { href: "/dashboard/presenca", icon: Wind, label: "Presença" },
    { href: "/dashboard/cerebro", icon: Brain, label: "Cérebro" },
  ];

  return (
    <aside className="w-20 border-r border-[#E5E7EB] bg-[#F5F5F0] hidden md:flex flex-col items-center py-8 z-10 sticky top-0 h-screen">
      {/* Logo */}
      <div className="h-10 w-10 bg-[#1F2937] rounded-xl flex items-center justify-center mb-10">
        <span className="text-white font-bold text-xs">TC</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col items-center gap-6 w-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1.5 group relative w-full"
            >
              {isActive && (
                <div className="bg-[#84A59D] w-1 h-6 rounded-r-lg absolute left-0 transition-all" />
              )}
              <item.icon
                className={`h-5 w-5 transition-colors ${
                  isActive ? "text-[#1F2937]" : "text-[#9CA3AF] group-hover:text-[#64748B]"
                }`}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span
                className={`text-[9px] font-semibold transition-colors ${
                  isActive ? "text-[#1F2937]" : "text-[#9CA3AF] group-hover:text-[#64748B]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center gap-1 text-[#9CA3AF] hover:text-red-400 transition-colors mb-4"
      >
        <LogOut className="h-4 w-4" strokeWidth={1.8} />
        <span className="text-[8px] font-semibold">Sair</span>
      </button>
    </aside>
  );
}
