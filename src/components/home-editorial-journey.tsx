"use client";

import { motion } from "framer-motion";
import { JourneyPhonePreview } from "./journey-phone-preview";
import { CheckSquare, LayoutDashboard, Zap, BrainCircuit, Target, Flame } from "lucide-react";

// Copy super agressivo e focado na dor
const steps = [
  {
    title: "Sua mente não é um depósito.",
    description: "Descarregue o caos antes que ele te paralise. Transformamos centenas de pensamentos invasivos em uma fila visual e pacífica, sem o peso da culpa.",
    icon: BrainCircuit,
    accent: "text-[#84A59D]",
    bgAccent: "bg-[#84A59D]/10",
  },
  {
    title: "O Fim da Lista Interminável.",
    description: "Chega de planners que você abandona no terceiro dia. Nosso sistema blinda sua atenção e te força a escolher apenas o essencial. Respeite sua energia diária.",
    icon: Target,
    accent: "text-[#F59E0B]",
    bgAccent: "bg-[#F59E0B]/10",
  },
  {
    title: "O Botão de Emergência.",
    description: "Para os dias em que a neblina mental vence. Um clique para acionar o Protocolo SOS: micro-ações guiadas para quebrar a inércia e dar o primeiro passo.",
    icon: Flame,
    accent: "text-[#EF4444]",
    bgAccent: "bg-[#EF4444]/10",
  }
];

function DesktopDashboardMockup() {
  return (
    <div className="w-full h-full bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white overflow-hidden flex flex-col relative group">
      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      {/* Mac Header */}
      <div className="h-10 bg-[#F8FAFC]/80 backdrop-blur-md border-b border-gray-200/50 flex items-center px-4 gap-2 relative z-10">
        <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-sm" />
        <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm" />
        <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-sm" />
      </div>

      <div className="flex-1 flex p-4 gap-5 relative z-10">
        {/* Sidebar */}
        <div className="w-1/4 bg-gray-50/50 rounded-xl hidden sm:block border border-gray-100/50 p-4 space-y-4">
           <div className="flex items-center gap-2">
             <div className="w-5 h-5 rounded bg-[#84A59D]/20 flex items-center justify-center"><CheckSquare size={12} className="text-[#84A59D]" /></div>
             <div className="h-3 w-16 bg-gray-200/80 rounded" />
           </div>
           <div className="space-y-3 pl-7">
             <div className="h-2 w-12 bg-gray-200/80 rounded" />
             <div className="h-2 w-20 bg-gray-200/80 rounded" />
             <div className="h-2 w-16 bg-[#84A59D]/60 rounded shadow-[0_0_8px_rgba(132,165,157,0.4)]" />
           </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-5">
           <div className="h-8 w-40 bg-gray-100/80 rounded-lg" />
           
           {/* Focus Cards */}
           <div className="grid grid-cols-2 gap-4">
             <div className="h-24 bg-gradient-to-br from-[#84A59D]/10 to-[#84A59D]/5 rounded-xl border border-[#84A59D]/20 p-4 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#84A59D]/20 rounded-full blur-xl" />
                <div className="h-2 w-16 bg-[#84A59D]/60 rounded relative z-10" />
                <div className="h-6 w-10 bg-[#84A59D] rounded relative z-10 shadow-md" />
             </div>
             <div className="h-24 bg-gray-50/50 rounded-xl border border-gray-100/50 p-4 flex flex-col justify-between">
                <div className="h-2 w-16 bg-gray-200 rounded" />
                <div className="h-6 w-10 bg-gray-200 rounded" />
             </div>
           </div>

           {/* Progress Section */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-100/50 p-5 space-y-4">
              <div className="flex justify-between items-center">
                 <div className="h-3 w-24 bg-gray-200 rounded" />
                 <div className="h-3 w-8 bg-[#84A59D]/40 rounded" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded border-2 border-gray-200" />
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                     <div className="h-full w-3/4 bg-[#84A59D]" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded bg-[#84A59D] flex items-center justify-center">
                    <CheckSquare size={10} className="text-white" />
                  </div>
                  <div className="h-2 w-2/3 bg-gray-100 rounded-full" />
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function FocusMockup() {
  return (
    <div className="w-full h-full bg-[#0F172A] rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden flex flex-col items-center justify-center relative group">
       {/* Ambient Neon Glow */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#EF4444]/20 rounded-full blur-[100px] group-hover:bg-[#EF4444]/30 transition-all duration-700" />
       
       <div className="z-10 text-center space-y-8 flex flex-col items-center w-full px-8 relative">
          
          {/* Animated Timer Ring */}
          <div className="relative w-32 h-32 flex items-center justify-center">
             <svg className="absolute inset-0 w-full h-full -rotate-90">
               <circle cx="64" cy="64" r="60" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
               <motion.circle 
                 cx="64" cy="64" r="60" 
                 stroke="#EF4444" 
                 strokeWidth="4" 
                 fill="none" 
                 strokeDasharray="377" 
                 initial={{ strokeDashoffset: 377 }}
                 whileInView={{ strokeDashoffset: 100 }}
                 transition={{ duration: 2, ease: "easeOut" }}
                 className="drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"
               />
             </svg>
             <span className="text-4xl font-display font-black text-white drop-shadow-md">25:00</span>
          </div>

          <div className="w-full bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-inner">
             <div className="flex items-center justify-center gap-2 mb-4">
               <Zap size={14} className="text-[#EF4444]" />
               <div className="h-3 w-24 bg-white/20 rounded" />
             </div>
             <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#EF4444] to-[#F87171]" 
                  initial={{ w: "0%" }}
                  whileInView={{ width: "65%" }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
             </div>
          </div>
       </div>
    </div>
  );
}

export function HomeEditorialJourney() {
  return (
    <div className="flex flex-col">
      {/* SECTION 1 - White - Phone */}
      <section className="bg-white py-24 lg:py-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-[#84A59D]/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col justify-center order-2 lg:order-1 relative z-10"
            >
              <div className={`w-14 h-14 ${steps[0].bgAccent} ${steps[0].accent} rounded-2xl flex items-center justify-center mb-8 shadow-sm`}>
                {(() => { const Icon = steps[0].icon; return <Icon className="w-7 h-7" />; })()}
              </div>
              <h2 className="text-4xl lg:text-6xl font-display font-black text-[#1F2937] mb-6 leading-tight tracking-tight">
                {steps[0].title}
              </h2>
              <p className="text-lg lg:text-xl text-[#64748B] font-medium leading-relaxed">
                {steps[0].description}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex items-center justify-center order-1 lg:order-2 perspective-[1000px]"
            >
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-[280px] sm:w-[320px] h-[580px] transform scale-90 lg:scale-100 origin-center pointer-events-none drop-shadow-2xl"
              >
                <JourneyPhonePreview activeIndex={1} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - Off White - Desktop */}
      <section className="bg-[#FAF9F6] py-24 lg:py-32 overflow-hidden relative border-y border-gray-100">
        <div className="absolute top-1/2 left-0 w-1/3 h-1/2 bg-[#F59E0B]/5 blur-3xl rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex items-center justify-center order-1 lg:order-1 perspective-[1000px] relative z-10"
            >
              <motion.div 
                animate={{ y: [0, -15, 0] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="w-full max-w-md lg:max-w-xl aspect-[4/3] drop-shadow-2xl"
              >
                <DesktopDashboardMockup />
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col justify-center order-2 lg:order-2 relative z-10"
            >
              <div className={`w-14 h-14 ${steps[1].bgAccent} ${steps[1].accent} rounded-2xl flex items-center justify-center mb-8 shadow-sm`}>
                {(() => { const Icon = steps[1].icon; return <Icon className="w-7 h-7" />; })()}
              </div>
              <h2 className="text-4xl lg:text-6xl font-display font-black text-[#1F2937] mb-6 leading-tight tracking-tight">
                {steps[1].title}
              </h2>
              <p className="text-lg lg:text-xl text-[#64748B] font-medium leading-relaxed">
                {steps[1].description}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - Dark Mode - Focus/SOS */}
      <section className="bg-[#0F172A] py-24 lg:py-32 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex flex-col justify-center order-2 lg:order-1"
            >
              <div className={`w-14 h-14 ${steps[2].bgAccent} ${steps[2].accent} rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-red-500/20 border border-red-500/20`}>
                {(() => { const Icon = steps[2].icon; return <Icon className="w-7 h-7" />; })()}
              </div>
              <h2 className="text-4xl lg:text-6xl font-display font-black text-white mb-6 leading-tight tracking-tight">
                {steps[2].title}
              </h2>
              <p className="text-lg lg:text-xl text-gray-400 font-medium leading-relaxed">
                {steps[2].description}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
              className="flex items-center justify-center order-1 lg:order-2 perspective-[1000px]"
            >
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="w-full max-w-sm aspect-square"
              >
                <FocusMockup />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
