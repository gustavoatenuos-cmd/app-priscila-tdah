"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { JourneyPhonePreview } from "./journey-phone-preview";

const JOURNEY_POINTS = [
  {
    title: "Check-in de Energia",
    description: "Antes de planejar, o app entende como você está: energia, humor, ansiedade e clareza mental.",
  },
  {
    title: "Descarrego Mental",
    description: "Tire da cabeça pensamentos, tarefas e preocupações sem precisar organizar tudo na hora.",
  },
  {
    title: "Top 3 Prioridades",
    description: "Transforme o excesso em clareza, separando o que é essencial do que é adiável.",
  },
  {
    title: "Ritual de Foco",
    description: "Blocos curtos, próximo micro-passo e redução de distrações para ajudar a começar sem paralisia.",
  },
  {
    title: "Plano B do Dia",
    description: "Quando a energia cair, o app adapta a rotina em vez de cobrar perfeição. Proteja sua constância.",
  },
  {
    title: "Journal + Insights",
    description: "Perceba padrões, entenda suas travas e veja seu progresso invisível evoluir ao longo do tempo.",
  },
  {
    title: "Sua Segunda Mente",
    description: "Um sistema que acolhe o caos, organiza o essencial e ajuda você a continuar sem culpa.",
  }
];

export function HomeJourneySection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll progress for the organic line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section className="py-32 bg-white relative" ref={containerRef}>
      <div className="container mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-24">
          <h2 className="text-4xl md:text-5xl font-display font-black text-[#1F2937] tracking-tight mb-6">
            Da sobrecarga à constância possível
          </h2>
          <p className="text-xl text-[#64748B] font-medium leading-relaxed">
            Descubra como o app acompanha o seu ritmo e organiza a sua mente, passo a passo, respeitando a sua energia.
          </p>
        </div>

        <div className="flex flex-col md:flex-row max-w-6xl mx-auto gap-12 lg:gap-24 relative">
          
          {/* Left Column: Text Points */}
          <div className="flex-1 relative pb-32">
            
            {/* Background dashed line */}
            <div className="absolute left-[27px] top-4 bottom-0 w-[2px] bg-[#E5E7EB] border-dashed" />
            
            {/* Animated solid line */}
            <motion.div 
              className="absolute left-[27px] top-4 bottom-0 w-[2px] bg-[#84A59D] origin-top"
              style={{ scaleY }}
            />

            <div className="space-y-48 pt-4">
              {JOURNEY_POINTS.map((point, index) => {
                const isActive = activeIndex === index;
                
                return (
                  <motion.div
                    key={index}
                    className="relative pl-20"
                    onViewportEnter={() => setActiveIndex(index)}
                    viewport={{ margin: "-45% 0px -45% 0px" }} // Triggers when the item hits the center 10% of the viewport
                  >
                    {/* Circle Indicator */}
                    <div 
                      className={`absolute left-[15px] top-1 h-6 w-6 rounded-full border-[3px] flex items-center justify-center transition-colors duration-500 bg-white ${
                        isActive ? "border-[#84A59D]" : "border-[#D1D5DB]"
                      }`}
                    >
                      <div className={`h-2 w-2 rounded-full transition-colors duration-500 ${isActive ? "bg-[#84A59D]" : "bg-transparent"}`} />
                    </div>

                    {/* Number Label */}
                    <div className="mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isActive ? "text-[#84A59D]" : "text-[#9CA3AF]"}`}>
                        Passo {index + 1}
                      </span>
                    </div>

                    {/* Text Content */}
                    <motion.div
                      animate={{ opacity: isActive ? 1 : 0.4, x: isActive ? 0 : -5 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className="text-2xl md:text-3xl font-display font-black text-[#1F2937] mb-4">
                        {point.title}
                      </h3>
                      <p className="text-lg text-[#64748B] font-medium leading-relaxed max-w-md">
                        {point.description}
                      </p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Sticky Mockup */}
          <div className="hidden md:block flex-1 relative">
            <div className="sticky top-1/2 -translate-y-1/2 pt-10">
              <JourneyPhonePreview activeIndex={activeIndex} />
              
              {/* Organic bg element behind the phone */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#F5F5F0] rounded-full blur-[80px] -z-10" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
