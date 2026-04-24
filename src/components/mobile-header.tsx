"use client";

import { Menu, X, User, BarChart2, BookOpen, Crown, HelpCircle, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (data) setProfile(data);
      }
    }
    loadProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const menuItems = [
    { href: "/dashboard/analytics", icon: BarChart2, label: "Análises" },
    { href: "/dashboard/journal", icon: BookOpen, label: "Diário" },
    { href: "/dashboard/support", icon: HelpCircle, label: "IA Ajuda" },
    { href: "/pricing", icon: Crown, label: "Assine Premium" },
  ];

  return (
    <>
      <header className="md:hidden sticky top-0 z-40 w-full bg-[#F5F5F0]/80 backdrop-blur-md border-b border-[#E5E7EB] px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="h-8 w-8 bg-[#1F2937] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">TC</span>
           </div>
           <h1 className="text-xs font-black tracking-[0.2em] text-[#1F2937] uppercase">TDAH Constante</h1>
        </div>

        <button 
          onClick={() => setIsOpen(true)}
          className="h-10 w-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#64748B] shadow-sm active:scale-95 transition-transform"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] md:hidden"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-xs bg-white z-[70] md:hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-[#F1F5F9] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B]">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1F2937]">{profile?.full_name || "Sua Conta"}</p>
                    <p className="text-[10px] font-black text-[#84A59D] uppercase tracking-widest">Assistente Pessoal</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 text-[#9CA3AF] hover:text-[#1F2937]">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex-1 p-6 space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] mb-4 ml-2">Explorar</p>
                  {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link 
                        key={item.href} 
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                          isActive ? 'bg-[#64748B]/5 text-[#64748B]' : 'text-[#9CA3AF] hover:bg-[#F9FAFB] hover:text-[#1F2937]'
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="text-sm font-bold">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </nav>

              <div className="p-6 border-t border-[#F1F5F9]">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm"
                >
                  <LogOut className="h-5 w-5" />
                  Sair da Conta
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
