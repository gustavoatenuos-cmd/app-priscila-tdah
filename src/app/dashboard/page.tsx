"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, Home, CheckSquare, Target, BarChart2, BookOpen, Search, Pause } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function NeumorphicDashboard() {
  const currentDate = format(new Date(), "EEEE, MMM dd, yyyy | hh:mm a", { locale: ptBR });

  return (
    <div className="flex bg-[#F5F5F0] min-h-screen text-[#333333] font-sans selection:bg-[#64748B]/20">
      
      {/* THIN SIDEBAR */}
      <aside className="w-24 border-r border-[#E5E7EB] bg-[#F5F5F0] hidden md:flex flex-col items-center py-8 z-10 sticky top-0 h-screen transition-all">
        <div className="bg-[#64748B] w-2 h-8 rounded-r-lg absolute left-0 top-[108px]"></div> {/* Active Indicator */}

        {/* Icons */}
        <nav className="flex-1 flex flex-col items-center gap-10 mt-4">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 group">
            <Home className="h-6 w-6 text-[#64748B]" strokeWidth={2.5} />
            <span className="text-[10px] font-bold text-[#64748B]">Home</span>
          </Link>
          <Link href="/dashboard/planner" className="flex flex-col items-center gap-1 group">
            <CheckSquare className="h-6 w-6 text-[#9CA3AF] group-hover:text-[#64748B] transition-colors" strokeWidth={2} />
            <span className="text-[10px] font-bold text-[#9CA3AF] group-hover:text-[#64748B]">Tasks</span>
          </Link>
          <Link href="/dashboard/focus" className="flex flex-col items-center gap-1 group">
            <Target className="h-6 w-6 text-[#9CA3AF] group-hover:text-[#64748B] transition-colors" strokeWidth={2} />
            <span className="text-[10px] font-bold text-[#9CA3AF] group-hover:text-[#64748B]">Focus</span>
          </Link>
          <Link href="/dashboard/analytics" className="flex flex-col items-center gap-1 group">
            <BarChart2 className="h-6 w-6 text-[#9CA3AF] group-hover:text-[#64748B] transition-colors" strokeWidth={2} />
            <span className="text-[10px] font-bold text-[#9CA3AF] group-hover:text-[#64748B]">Insights</span>
          </Link>
          <Link href="/dashboard/journal" className="flex flex-col items-center gap-1 group">
            <BookOpen className="h-6 w-6 text-[#9CA3AF] group-hover:text-[#64748B] transition-colors" strokeWidth={2} />
            <span className="text-[10px] font-bold text-[#9CA3AF] group-hover:text-[#64748B]">Goals</span>
          </Link>
        </nav>

        {/* Streak Block */}
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl flex flex-col items-center justify-center p-3 shadow-[0_4px_15px_rgba(0,0,0,0.02)]">
          <span className="text-[8px] font-bold text-[#9CA3AF] uppercase text-center leading-tight tracking-wider">Current<br/>Streak</span>
          <span className="text-2xl font-black text-[#333333] font-mono mt-1">14</span>
          <span className="text-[9px] font-bold text-[#9CA3AF] uppercase">Days</span>
        </div>
      </aside>

      {/* MAIN CONTENT DASHBOARD */}
      <main className="flex-1 px-8 py-10 md:px-14 lg:max-w-7xl mx-auto overflow-y-auto">
         
         <header className="mb-10">
           <h1 className="text-3xl font-extrabold tracking-tight text-[#1F2937] uppercase">ADHD Productivity Dashboard</h1>
           <p className="text-[#64748B] font-medium text-sm mt-1">{currentDate}</p>
         </header>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT BIG COLUMN */}
            <div className="lg:col-span-8 flex flex-col gap-8">
               
               {/* DAILY FOCUS PANEL */}
               <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#FFFFFF] rounded-3xl p-8 shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-[#E5E7EB]/50">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-sm font-bold text-[#333333] tracking-widest uppercase">Daily Focus</h2>
                    <span className="text-[#9CA3AF] tracking-widest font-bold">•••</span>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-12">
                     {/* Circular Progress SVG */}
                     <div className="relative w-40 h-40 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" stroke="#F1F5F9" strokeWidth="12" fill="none" />
                          <circle cx="50" cy="50" r="40" stroke="#64748B" strokeWidth="12" fill="none" strokeDasharray="251" strokeDashoffset="62" strokeLinecap="round" />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-3xl font-extrabold text-[#333333] font-mono tracking-tighter">75%</span>
                          <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">Complete</span>
                        </div>
                     </div>

                     {/* Stats */}
                     <div className="flex flex-col gap-6">
                        <div>
                          <h3 className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest">Tasks Done:</h3>
                          <span className="text-3xl font-black text-[#333333] font-mono tracking-tighter">12/16</span>
                        </div>
                        <div>
                          <h3 className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest">Minutes Focused:</h3>
                          <span className="text-3xl font-black text-[#333333] font-mono tracking-tighter">180m</span>
                        </div>
                     </div>
                  </div>
               </motion.div>

               {/* UPCOMING SCHEDULE PANEL */}
               <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-[#FFFFFF] rounded-3xl p-8 shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-[#E5E7EB]/50 flex-1">
                  <h2 className="text-sm font-bold text-[#333333] tracking-widest uppercase mb-8">Upcoming Schedule</h2>
                  
                  <div className="relative pl-6 border-l-2 border-[#E5E7EB] space-y-10 ml-4">
                     {/* Item 1 */}
                     <div className="relative">
                        <div className="absolute w-4 h-4 rounded-full bg-[#84A59D] -left-[35px] top-1 border-[4px] border-[#FFFFFF] shadow-sm"></div>
                        <div className="flex items-center gap-6">
                           <span className="text-sm font-bold text-[#9CA3AF] w-20 font-mono">9:00 AM</span>
                           <span className="text-[15px] font-bold text-[#333333]">Review Project Plan</span>
                        </div>
                     </div>

                     {/* Item 2 */}
                     <div className="relative">
                        <div className="absolute w-4 h-4 rounded-full bg-[#64748B] -left-[35px] top-1 border-[4px] border-[#FFFFFF] shadow-sm"></div>
                        <div className="flex items-center gap-6">
                           <span className="text-sm font-bold text-[#9CA3AF] w-20 font-mono">10:30 AM</span>
                           <span className="text-[15px] font-bold text-[#333333]">Deep Work Session</span>
                        </div>
                     </div>

                     {/* Item 3 */}
                     <div className="relative">
                        <div className="absolute w-4 h-4 rounded-full bg-[#84A59D] -left-[35px] top-1 border-[4px] border-[#FFFFFF] shadow-sm"></div>
                        <div className="flex items-center gap-6">
                           <span className="text-sm font-bold text-[#9CA3AF] w-20 font-mono">12:00 PM</span>
                           <span className="text-[15px] font-bold text-[#333333]">Team Sync</span>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>

            {/* RIGHT SMALL COLUMN */}
            <div className="lg:col-span-4 flex flex-col gap-8">
               
               {/* TASK MANAGER PANEL */}
               <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-[#FFFFFF] rounded-3xl p-6 md:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-[#E5E7EB]/50">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-bold text-[#333333] tracking-widest uppercase">Task Manager</h2>
                    <span className="text-[#9CA3AF] tracking-widest font-bold">•••</span>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                       <CheckCircle2 className="h-5 w-5 text-[#84A59D] fill-[#84A59D]/20" />
                       <span className="text-[14px] font-bold text-[#333333]">Complete Report</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <CheckCircle2 className="h-5 w-5 text-[#84A59D] fill-[#84A59D]/20" />
                       <span className="text-[14px] font-bold text-[#333333]">Send Emails</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <Circle className="h-5 w-5 text-[#9CA3AF] fill-[#F1F5F9]" />
                       <span className="text-[14px] font-bold text-[#9CA3AF]">Plan Week</span>
                     </div>
                  </div>
               </motion.div>

               {/* FOCUS SESSION PANEL */}
               <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-[#FFFFFF] rounded-3xl p-6 md:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-[#E5E7EB]/50 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-bold text-[#333333] tracking-widest uppercase">Focus Session</h2>
                    <span className="text-[#9CA3AF] tracking-widest font-bold">•••</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <button className="w-full bg-[#64748B] hover:bg-[#475569] text-white font-bold text-xs tracking-widest uppercase py-4 rounded-xl transition-all shadow-md shadow-[#64748B]/20">
                      Start / Stop
                    </button>
                    
                    <div className="mt-6 text-center">
                      <span className="text-3xl font-black text-[#333333] font-mono">00:45:00</span>
                      <span className="text-sm font-bold text-[#9CA3AF] font-mono ml-2">/ 01:00:00</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-6 border-t border-[#E5E7EB]/50">
                     <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest">Deep Work</span>
                     <div className="h-6 w-10 bg-[#64748B] rounded-full p-1 flex justify-end items-center cursor-pointer">
                        <div className="h-4 w-4 bg-white rounded-full"></div>
                     </div>
                  </div>
               </motion.div>

               {/* WELLNESS CHECK PANEL */}
               <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-[#FFFFFF] rounded-3xl p-6 md:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-[#E5E7EB]/50">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-bold text-[#333333] tracking-widest uppercase">Wellness Check</h2>
                    <span className="text-[#9CA3AF] tracking-widest font-bold">•••</span>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-[13px] font-bold text-[#333333]">Hydration</span>
                        <div className="w-24 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                           <div className="h-full bg-[#84A59D] w-[60%]"></div>
                        </div>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-[13px] font-bold text-[#333333]">Steps</span>
                        <div className="w-24 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                           <div className="h-full bg-[#84A59D] w-[80%]"></div>
                        </div>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-[13px] font-bold text-[#333333]">Mood</span>
                        <div className="w-24 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                           <div className="h-full bg-[#84A59D] w-[40%]"></div>
                        </div>
                     </div>
                  </div>
               </motion.div>

            </div>
         </div>
      </main>
    </div>
  );
}
