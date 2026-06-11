"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { JourneyPhonePreview } from "./journey-phone-preview";
import { Quote, Sparkles, Pin } from "lucide-react";

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
    title: "Segunda Mente",
    description: "Um sistema que acolhe o caos, organiza o essencial e ajuda você a continuar sem culpa.",
  }
];

export function HomeEditorialJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const lineProgressRaw = useTransform(scrollYProgress, [0.15, 0.95], [0, 1]);
  const lineScaleY = useSpring(lineProgressRaw, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Parallax for the entire collage group fading out as we scroll to the journey
  const collageOpacity = useTransform(scrollYProgress, [0.08, 0.15], [1, 0]);
  const collageY = useTransform(scrollYProgress, [0, 0.15], [0, -150]);

  // Parallax layers within the collage
  const bgPanelLeftY = useTransform(scrollYProgress, [0, 0.15], [0, -200]);
  const bgPanelRightY = useTransform(scrollYProgress, [0, 0.15], [0, -100]);
  const smallCard1Y = useTransform(scrollYProgress, [0, 0.15], [0, -300]);
  const smallCard2Y = useTransform(scrollYProgress, [0, 0.15], [0, -250]);
  const smallCard3Y = useTransform(scrollYProgress, [0, 0.15], [0, -350]);
  const smallCard4Y = useTransform(scrollYProgress, [0, 0.15], [0, -180]);

  // Mockup translation
  // Moves from center to right side on desktop
  const mockupX = useTransform(scrollYProgress, [0, 0.15], ["-50%", "15%"]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[550vh] bg-[#FAF9F6] font-sans"
    >
      {/* Editorial Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      {/* 
        ========================================================
        STICKY LAYER (Always visible in the viewport)
        ========================================================
      */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* === EDITORIAL COLLAGE HERO === */}
        <motion.div 
          style={{ opacity: collageOpacity, y: collageY }} 
          className="absolute inset-0 pointer-events-none flex items-center justify-center z-10"
        >
          {/* Main Integrated Title */}
          <div className="absolute top-[12%] md:top-[8%] z-40 text-center w-full px-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-[#1F2937] tracking-tight leading-[1.1] max-w-2xl mx-auto drop-shadow-md"
            >
              Constância possível.<br/>
              <span className="text-[#84A59D]">Sem rotinas irreais.</span>
            </motion.h1>
            <p className="mt-4 text-xs font-bold text-[#64748B] uppercase tracking-[0.2em]">
              Um sistema para organizar sua mente, não só sua agenda
            </p>
          </div>

          {!isMobile && (
            <>
              {/* LARGE BACKGROUND PANELS */}
              {/* Left Back Panel (Pains/Chaos) */}
              <motion.div 
                style={{ y: bgPanelLeftY }}
                initial={{ opacity: 0, rotate: -8, x: -50 }}
                animate={{ opacity: 1, rotate: -6, x: 0 }}
                transition={{ duration: 1, delay: 0.1 }}
                className="absolute left-[8%] top-[25%] w-[340px] h-[480px] bg-[#F3E8E6] rounded-3xl shadow-2xl border border-white p-8 flex flex-col justify-between opacity-90"
              >
                <div>
                  <h3 className="text-xl font-display font-black text-[#1F2937] mb-2 opacity-80">A Sobrecarga</h3>
                  <div className="h-0.5 w-12 bg-[#1F2937] opacity-20 mb-6" />
                  <p className="text-[#475569] font-medium leading-relaxed opacity-80">
                    O cérebro TDAH não funciona com planners rígidos. Tentar forçar o foco só gera paralisação e culpa.
                  </p>
                </div>
                <div className="flex gap-2 opacity-40">
                  <div className="h-16 w-full bg-[#1F2937] rounded-xl" />
                  <div className="h-16 w-1/2 bg-[#1F2937] rounded-xl" />
                </div>
              </motion.div>

              {/* Right Back Panel (Transformation) */}
              <motion.div 
                style={{ y: bgPanelRightY }}
                initial={{ opacity: 0, rotate: 6, x: 50 }}
                animate={{ opacity: 1, rotate: 4, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute right-[8%] top-[20%] w-[340px] h-[520px] bg-[#E8F0EE] rounded-3xl shadow-2xl border border-white p-8 flex flex-col justify-end opacity-90"
              >
                <div className="flex justify-end gap-2 mb-6 opacity-40">
                  <div className="h-12 w-12 bg-[#84A59D] rounded-full" />
                  <div className="h-12 w-24 bg-[#84A59D] rounded-full" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-black text-[#1F2937] mb-2 opacity-80 text-right">O Recomeço</h3>
                  <div className="h-0.5 w-12 bg-[#1F2937] opacity-20 mb-6 ml-auto" />
                  <p className="text-[#475569] font-medium leading-relaxed opacity-80 text-right">
                    Você não precisa ser perfeita, só precisa de uma ferramenta que te ajude a dar o próximo passo.
                  </p>
                </div>
              </motion.div>

              {/* FLOATING POST-ITS & POLAROIDS (The Details) */}
              {/* Pain 1 */}
              <motion.div
                style={{ y: smallCard1Y }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute left-[22%] top-[35%] bg-[#FFF9ED] p-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-[#FDE68A] w-48 -rotate-12 z-20"
              >
                <Pin className="absolute -top-3 left-1/2 -translate-x-1/2 text-[#D97706] drop-shadow-md" size={20} fill="#F59E0B" />
                <p className="text-[11px] font-bold text-[#B45309] leading-tight text-center mt-2">
                  "Comecei e parei de novo. Minha cabeça não desliga."
                </p>
              </motion.div>

              {/* Pain 2 */}
              <motion.div
                style={{ y: smallCard2Y }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute left-[6%] top-[65%] bg-white p-5 rounded-2xl shadow-xl border border-[#E5E7EB] w-52 rotate-6 z-20"
              >
                <Quote className="text-[#9CA3AF] mb-2" size={16} />
                <p className="text-[12px] text-[#475569] font-medium italic">
                  "Não sei por onde começar. Hoje minha energia tá no chão..."
                </p>
              </motion.div>

              {/* Transform 1 */}
              <motion.div
                style={{ y: smallCard3Y }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute right-[24%] top-[60%] bg-[#1F2937] p-5 rounded-2xl shadow-2xl border border-[#374151] w-48 -rotate-3 z-20 text-white"
              >
                <Sparkles className="text-[#84A59D] mb-2" size={18} />
                <p className="text-[12px] font-bold leading-relaxed">
                  Menos culpa.<br/>Mais clareza.
                </p>
              </motion.div>

              {/* Transform 2 */}
              <motion.div
                style={{ y: smallCard4Y }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="absolute right-[5%] top-[30%] bg-white p-4 rounded-xl shadow-lg border border-[#E5E7EB] w-56 rotate-12 z-20 flex items-center gap-3"
              >
                <div className="h-8 w-8 bg-[#84A59D]/10 rounded-full flex items-center justify-center">
                  <div className="h-3 w-3 bg-[#84A59D] rounded-full" />
                </div>
                <p className="text-[11px] font-black uppercase tracking-wider text-[#1F2937]">Plano Adaptado</p>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* === THE CENTERPIECE: MOCKUP === */}
        <motion.div 
          style={isMobile ? { x: "-50%", y: "-35%", scale: 0.85 } : { x: mockupX, y: "-35%", scale: 1 }} 
          className="absolute left-1/2 top-1/2 z-50 pointer-events-auto"
        >
          <JourneyPhonePreview activeIndex={activeIndex} />
        </motion.div>

      </div>


      {/* 
        ========================================================
        SCROLLING LAYER (The Journey Content)
        ========================================================
      */}
      <div className="relative z-10 w-full pt-[80vh] md:pt-[100vh] pb-[50vh] pointer-events-auto">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row">
          
          <div className="w-full md:w-1/2 relative pt-[40vh] md:pt-[20vh]">
            
            <div className="absolute left-[27px] top-0 bottom-0 w-[2px] bg-[#E5E7EB] border-dashed" />
            
            <motion.div 
              className="absolute left-[27px] top-0 bottom-0 w-[2px] bg-[#84A59D] origin-top"
              style={{ scaleY: lineScaleY }}
            />

            <div className="space-y-[40vh] md:space-y-[60vh] py-[20vh]">
              {JOURNEY_POINTS.map((point, index) => {
                const isActive = activeIndex === index;
                
                return (
                  <motion.div
                    key={index}
                    className="relative pl-16 md:pl-20"
                    onViewportEnter={() => setActiveIndex(index)}
                    viewport={{ margin: isMobile ? "-70% 0px -30% 0px" : "-45% 0px -45% 0px" }}
                  >
                    <div 
                      className={`absolute left-[15px] top-1 h-6 w-6 rounded-full border-[3px] flex items-center justify-center transition-colors duration-500 bg-[#FAF9F6] ${
                        isActive ? "border-[#84A59D]" : "border-[#D1D5DB]"
                      }`}
                    >
                      <div className={`h-2 w-2 rounded-full transition-colors duration-500 ${isActive ? "bg-[#84A59D]" : "bg-transparent"}`} />
                    </div>

                    <div className="mb-3">
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isActive ? "text-[#84A59D]" : "text-[#9CA3AF]"}`}>
                        Passo {index + 1}
                      </span>
                    </div>

                    <motion.div
                      animate={{ opacity: isActive ? 1 : 0.3, x: isActive ? 0 : -5 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[2rem] border border-white shadow-xl shadow-[#1F2937]/5"
                    >
                      <h3 className="text-2xl md:text-3xl font-display font-black text-[#1F2937] mb-4 leading-tight">
                        {point.title}
                      </h3>
                      <p className="text-base md:text-lg text-[#475569] font-medium leading-relaxed">
                        {point.description}
                      </p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="hidden md:block w-1/2" />

        </div>
      </div>
    </div>
  );
}
