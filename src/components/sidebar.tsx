"use client";

import { useState, useEffect } from "react";

import {
  Home,
  BookOpen,
  CheckSquare,
  Wind,
  Brain,
  LogOut,
  BookMarked,
  Timer,
  CloudLightning,
  Headphones,
  User,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { AppLogo } from "@/components/app-logo";

const navItems = [
  { href: "/dashboard",              icon: Home,           label: "Início" },
  { href: "/dashboard/cerebro",      icon: Brain,          label: "Cérebro" },
  { href: "/dashboard/presenca-365", icon: BookOpen,       label: "365 Dias" },
  { href: "/dashboard/planner",      icon: CheckSquare,    label: "Planner" },
  { href: "/dashboard/focus",        icon: Timer,          label: "Foco" },
  { href: "/dashboard/journal",      icon: BookMarked,     label: "Diário" },
  { href: "/dashboard/brain-dump",   icon: CloudLightning, label: "Mente" },
  { href: "/dashboard/sos",          icon: Headphones,     label: "SOS" },
  { href: "/dashboard/presenca",     icon: Wind,           label: "Presença" },
  { href: "/dashboard/profile",      icon: User,           label: "Perfil" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadAvatar() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('avatar_url').eq('id', user.id).single();
        if (data?.avatar_url) setAvatarUrl(data.avatar_url);
      }
    }
    loadAvatar();
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="w-20 border-r border-[#E5E7EB] bg-[#F5F5F0] hidden md:flex flex-col items-center py-6 z-10 sticky top-0 h-screen">
      {/* Logo */}
      <Link href="/dashboard/profile" className="mb-8 shrink-0 hover:opacity-90 transition-opacity">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="h-10 w-10 rounded-xl object-cover" />
        ) : (
          <AppLogo className="h-11 w-11 ring-1 ring-[#E5E7EB]" />
        )}
      </Link>

      {/* Nav */}
      <nav className="flex-1 flex flex-col items-center gap-1 w-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 group relative w-full py-3"
            >
              {isActive && (
                <div className="bg-[#84A59D] w-1 h-6 rounded-r-lg absolute left-0 top-1/2 -translate-y-1/2 transition-all" />
              )}
              <item.icon
                className={`h-5 w-5 transition-colors ${
                  isActive
                    ? "text-[#1F2937]"
                    : "text-[#9CA3AF] group-hover:text-[#64748B]"
                }`}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span
                className={`text-[9px] font-semibold transition-colors ${
                  isActive
                    ? "text-[#1F2937]"
                    : "text-[#9CA3AF] group-hover:text-[#64748B]"
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
        className="flex flex-col items-center gap-1 text-[#9CA3AF] hover:text-red-400 transition-colors mt-4 mb-2 shrink-0"
      >
        <LogOut className="h-4 w-4" strokeWidth={1.8} />
        <span className="text-[8px] font-semibold">Sair</span>
      </button>
    </aside>
  );
}
