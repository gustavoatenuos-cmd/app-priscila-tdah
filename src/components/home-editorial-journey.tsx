"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { JourneyPhonePreview } from "./journey-phone-preview";
import { CheckSquare, LayoutDashboard, Zap } from "lucide-react";

const steps = [
  {
    title: "Sua Mente no Papel",
    description: "Descarregue o caos. Transforme dezenas de pensamentos em uma lista visual sem sobrecarga.",
    icon: CheckSquare,
  },
  {
    title: "O Essencial do Dia",
    description: "Em vez de planilhas complexas, escolha apenas o que realmente importa hoje. Respeite sua energia.",
    icon: LayoutDashboard,
  },
  {
    title: "Protocolo SOS",
    description: "Quando a mente travar, aperte o botão. Ferramentas rápidas para sair da paralisia e dar o primeiro passo.",
    icon: Zap,
  }
];

// Mockup 1 (Celular) is handled by JourneyPhonePreview.

function DesktopDashboardMockup() {
  return (
    <div className="w-full h-full bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
      <div className="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-4 gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
      </div>
      <div className="flex-1 flex p-4 gap-4">
        <div className="w-1/4 bg-gray-50 rounded-lg hidden sm:block border border-gray-100 p-4 space-y-3">
           <div className="h-3 w-16 bg-gray-200 rounded" />
           <div className="h-2 w-12 bg-gray-200 rounded mt-6" />
           <div className="h-2 w-20 bg-gray-200 rounded" />
           <div className="h-2 w-16 bg-[#84A59D]/40 rounded" />
        </div>
        <div className="flex-1 space-y-4">
           <div className="h-6 w-32 bg-gray-100 rounded-md" />
           <div className="grid grid-cols-2 gap-4">
             <div className="h-20 bg-[#84A59D]/10 rounded-xl border border-[#84A59D]/20 p-4 flex flex-col justify-between">
                <div className="h-2 w-16 bg-[#84A59D]/40 rounded" />
                <div className="h-5 w-8 bg-[#84A59D] rounded" />
             </div>
             <div className="h-20 bg-gray-50 rounded-xl border border-gray-100 p-4" />
           </div>
           <div className="h-28 bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3">
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="flex items-center gap-2 mt-4">
                <div className="h-3 w-3 rounded bg-gray-300" />
                <div className="h-2 w-full bg-gray-200 rounded" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-[#84A59D]" />
                <div className="h-2 w-2/3 bg-gray-200 rounded" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function FocusMockup() {
  return (
    <div className="w-full h-full bg-[#1F2937] rounded-xl shadow-2xl overflow-hidden flex flex-col items-center justify-center relative">
       <div className="absolute top-0 right-0 w-64 h-64 bg-[#84A59D]/10 rounded-full blur-[80px]" />
       <div className="z-10 text-center space-y-6 flex flex-col items-center w-full px-8">
          <div className="w-24 h-24 rounded-full border-4 border-[#84A59D] flex items-center justify-center shadow-[0_0_40px_rgba(132,165,157,0.2)]">
             <span className="text-3xl font-display font-black text-white">25:00</span>
          </div>
          <div className="w-full bg-white/5 rounded-2xl p-4 border border-white/10">
             <div className="h-2 w-24 bg-white/20 rounded mx-auto mb-4" />
             <div className="h-1.5 w-full bg-white/10 rounded overflow-hidden">
                <div className="h-full w-1/3 bg-[#84A59D]" />
             </div>
          </div>
       </div>
    </div>
  );
}

export function HomeEditorialJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const step1Opacity = useTransform(scrollYProgress, [0, 0.2, 0.3, 0.4], [1, 1, 0, 0]);
  const step2Opacity = useTransform(scrollYProgress, [0.25, 0.35, 0.6, 0.7], [0, 1, 1, 0]);
  const step3Opacity = useTransform(scrollYProgress, [0.55, 0.65, 0.9, 1], [0, 1, 1, 1]);

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-white">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden py-20 px-6">
        
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          <div className="relative h-[30vh] lg:h-[40vh] flex flex-col justify-center">
            {/* Step 1 */}
            <motion.div style={{ opacity: step1Opacity }} className="absolute inset-0 flex flex-col justify-center pointer-events-none">
              <div className="w-12 h-12 bg-[#84A59D]/10 text-[#84A59D] rounded-xl flex items-center justify-center mb-6">
                 {(() => { const Icon1 = steps[0].icon; return <Icon1 className="w-6 h-6" />; })()}
              </div>
              <h2 className="text-3xl lg:text-5xl font-display font-black text-[#1F2937] mb-4 leading-tight">{steps[0].title}</h2>
              <p className="text-lg text-[#64748B] font-medium leading-relaxed">{steps[0].description}</p>
            </motion.div>

            {/* Step 2 */}
            <motion.div style={{ opacity: step2Opacity }} className="absolute inset-0 flex flex-col justify-center pointer-events-none">
              <div className="w-12 h-12 bg-[#84A59D]/10 text-[#84A59D] rounded-xl flex items-center justify-center mb-6">
                 {(() => { const Icon2 = steps[1].icon; return <Icon2 className="w-6 h-6" />; })()}
              </div>
              <h2 className="text-3xl lg:text-5xl font-display font-black text-[#1F2937] mb-4 leading-tight">{steps[1].title}</h2>
              <p className="text-lg text-[#64748B] font-medium leading-relaxed">{steps[1].description}</p>
            </motion.div>

            {/* Step 3 */}
            <motion.div style={{ opacity: step3Opacity }} className="absolute inset-0 flex flex-col justify-center pointer-events-none">
               <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-6">
                 {(() => { const Icon3 = steps[2].icon; return <Icon3 className="w-6 h-6" />; })()}
              </div>
              <h2 className="text-3xl lg:text-5xl font-display font-black text-[#1F2937] mb-4 leading-tight">{steps[2].title}</h2>
              <p className="text-lg text-[#64748B] font-medium leading-relaxed">{steps[2].description}</p>
            </motion.div>
          </div>

          <div className="relative h-[45vh] lg:h-[60vh] w-full flex items-center justify-center">
            
            {/* Step 1 Visual */}
            <motion.div 
              style={{ opacity: step1Opacity, y: useTransform(step1Opacity, [0, 1], [20, 0]) }} 
              className="absolute inset-0 flex items-center justify-center"
            >
               <div className="w-[280px] sm:w-[320px] h-[500px] transform scale-75 sm:scale-90 lg:scale-100 origin-center pointer-events-none">
                 <JourneyPhonePreview activeIndex={1} />
               </div>
            </motion.div>

            {/* Step 2 Visual */}
            <motion.div 
              style={{ opacity: step2Opacity, y: useTransform(step2Opacity, [0, 1], [20, 0]) }} 
              className="absolute inset-0 flex items-center justify-center p-4 lg:p-8"
            >
               <div className="w-full max-w-md lg:max-w-xl aspect-[4/3]">
                 <DesktopDashboardMockup />
               </div>
            </motion.div>

            {/* Step 3 Visual */}
            <motion.div 
              style={{ opacity: step3Opacity, y: useTransform(step3Opacity, [0, 1], [20, 0]) }} 
              className="absolute inset-0 flex items-center justify-center p-4 lg:p-8"
            >
               <div className="w-full max-w-sm aspect-square">
                 <FocusMockup />
               </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
