"use client";

import { motion } from "framer-motion";
import { 
  Calendar, Layout, Brain, Timer, 
  CheckCircle2, Sparkles, Heart, 
  ChevronLeft, Menu, X 
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TherapeuticShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  activeTab?: string;
}

export function TherapeuticShell({ 
  children, 
  title, 
  subtitle,
  activeTab 
}: TherapeuticShellProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tabs = [
    { id: "overview", label: "Início", icon: Layout, href: "/dashboard/therapeutic-planner" },
    { id: "monthly", label: "Mês", icon: Calendar, href: "/dashboard/therapeutic-planner/monthly" },
    { id: "weekly", label: "Semana", icon: CheckCircle2, href: "/dashboard/therapeutic-planner/weekly" },
    { id: "dump", label: "Mente", icon: Brain, href: "/dashboard/therapeutic-planner/mind-dump" },
    { id: "focus", label: "Foco", icon: Timer, href: "/dashboard/therapeutic-planner/focus-training" },
    { id: "exercises", label: "Diário", icon: Heart, href: "/dashboard/therapeutic-planner/exercises" },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#4A4A4A] font-sans selection:bg-[#F8E9E2] overflow-x-hidden">
      {/* Dynamic background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 50, 0], 
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-[#F8E9E2] blur-[120px] rounded-full opacity-40" 
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 0], 
            y: [0, 60, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -left-[5%] w-[40%] h-[40%] bg-[#D4E2D4] blur-[100px] rounded-full opacity-25" 
        />
        <motion.div 
          animate={{ 
            x: [0, 30, 0], 
            y: [0, -40, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] left-[10%] w-[45%] h-[45%] bg-[#F3E5F5] blur-[120px] rounded-full opacity-35" 
        />
      </div>

      <div className="relative flex flex-col md:flex-row min-h-screen">
        {/* Navigation Sidebar (Desktop) */}
        <aside className="hidden md:flex flex-col w-64 bg-white/40 backdrop-blur-md border-r border-[#F8E9E2] p-8 z-20">
          <Link href="/dashboard" className="flex items-center gap-2 mb-12 group">
            <div className="h-8 w-8 bg-[#A78B95] rounded-xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110">
              <ChevronLeft className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#A78B95]">Voltar</span>
          </Link>

          <nav className="space-y-4">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group",
                  activeTab === tab.id 
                    ? "bg-[#A78B95] text-white shadow-lg shadow-[#A78B95]/20 scale-105" 
                    : "hover:bg-white/60 text-[#7A7A7A] hover:text-[#4A4A4A]"
                )}
              >
                <tab.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", activeTab === tab.id ? "text-white" : "text-[#A78B95]")} />
                <span className="font-bold text-sm">{tab.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-8">
             <div className="bg-[#D4E2D4]/30 p-4 rounded-3xl border border-[#D4E2D4]/50">
                <div className="flex items-center gap-2 mb-2">
                   <Sparkles className="h-4 w-4 text-[#84A59D]" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-[#84A59D]">Autoacolhimento</span>
                </div>
                <p className="text-[11px] font-medium leading-relaxed italic text-[#5C7A5C]">
                  "Constância é recomeço, não perfeição."
                </p>
             </div>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-6 bg-white/60 backdrop-blur-md sticky top-0 z-30 border-b border-[#F8E9E2]">
          <h1 className="font-display text-xl font-bold text-[#A78B95]">Planner Terapêutico</h1>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="h-10 w-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-[#F8E9E2]"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden fixed inset-x-0 top-20 bg-white/95 backdrop-blur-xl border-b border-[#F8E9E2] p-6 z-40 space-y-4"
          >
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-2xl",
                  activeTab === tab.id ? "bg-[#A78B95] text-white" : "bg-gray-50"
                )}
              >
                <tab.icon className="h-6 w-6" />
                <span className="font-bold">{tab.label}</span>
              </Link>
            ))}
          </motion.div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col p-6 md:p-12 overflow-y-auto">
          <div className="max-w-4xl w-full mx-auto space-y-8">
            <header className="space-y-2">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl md:text-5xl font-display font-black text-[#1F2937] tracking-tight"
              >
                {title}
              </motion.h1>
              {subtitle && (
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-[#7A7A7A] font-medium"
                >
                  {subtitle}
                </motion.p>
              )}
            </header>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1"
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
