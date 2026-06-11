"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { JourneyPhonePreview } from "./journey-phone-preview";

const PAINS = [
  "Comecei e parei de novo.",
  "Minha cabeça não desliga.",
  "Tenho coisa demais para fazer.",
  "Não sei por onde começar.",
  "Hoje minha energia está baixa."
];

const TRANSFORMATIONS = [
  "Menos culpa.",
  "Mais clareza.",
  "Plano adaptado à energia.",
  "Recomeço sem cobrança.",
  "Próxima ação possível."
];

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

  // Smooth line animation for the Journey part
  // The Journey starts after the first 100vh, which is roughly 20% of a 500vh container.
  // We want the line to draw from 0.2 to 0.9.
  const lineProgressRaw = useTransform(scrollYProgress, [0.15, 0.95], [0, 1]);
  const lineScaleY = useSpring(lineProgressRaw, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Hero Parallax & Transitions (Active from 0 to 0.15)
  const heroOpacity = useTransform(scrollYProgress, [0.05, 0.12], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.12], [0, -100]);
  
  const leftPanelX = useTransform(scrollYProgress, [0, 0.12], [0, -300]);
  const leftPanelOpacity = useTransform(scrollYProgress, [0.02, 0.1], [1, 0]);

  const rightPanelX = useTransform(scrollYProgress, [0, 0.12], [0, 300]);
  const rightPanelOpacity = useTransform(scrollYProgress, [0.02, 0.1], [1, 0]);

  // Mockup movement: From Center (left: 50%, x: -50%) to Right (left: 50%, x: 200px or % based)
  // For desktop, moving it to the right half.
  const mockupX = useTransform(scrollYProgress, [0, 0.15], ["-50%", "20%"]);
  // On mobile, we keep it centered or stacked. We'll handle mobile with conditional rendering/classes.

  return (
    <div 
      ref={containerRef} 
      // 500vh ensures a long scroll: 100vh for Hero, 400vh for 7 journey points
      className="relative w-full h-[500vh] bg-[#FAF9F6] bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:24px_24px] font-sans"
    >
      {/* 
        ========================================================
        STICKY LAYER (Always visible in the viewport)
        ========================================================
      */}
      <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none flex items-center justify-center">
        
        {/* === HERO: TITLE === */}
        <motion.div 
          style={{ opacity: heroOpacity, y: heroY }} 
          className="absolute top-[12%] md:top-[15%] w-full px-6 text-center z-30"
        >
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#84A59D] mb-4">
            Um sistema para organizar sua mente, não só sua agenda
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-[#1F2937] tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Constância possível.<br/>Sem rotinas irreais.
          </h1>
        </motion.div>

        {/* === HERO: LEFT PANEL (PAINS) === */}
        {!isMobile && (
          <motion.div 
            style={{ x: leftPanelX, opacity: leftPanelOpacity, rotate: -4 }} 
            className="absolute left-[5%] xl:left-[10%] top-[30%] w-72 z-20 space-y-3"
          >
            {PAINS.map((pain, i) => (
              <div 
                key={i} 
                className="bg-[#F3E8E6] px-5 py-4 rounded-xl shadow-xl shadow-[#1F2937]/5 border border-white/50 backdrop-blur-sm"
              >
                <p className="text-sm font-medium text-[#475569] italic">"{pain}"</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* === HERO: RIGHT PANEL (TRANSFORMATION) === */}
        {!isMobile && (
          <motion.div 
            style={{ x: rightPanelX, opacity: rightPanelOpacity, rotate: 3 }} 
            className="absolute right-[5%] xl:right-[10%] top-[35%] w-72 z-20 space-y-3"
          >
            {TRANSFORMATIONS.map((trans, i) => (
              <div 
                key={i} 
                className="bg-[#E8F0EE] px-5 py-4 rounded-xl shadow-xl shadow-[#1F2937]/5 border border-white/50 backdrop-blur-sm flex items-center gap-3"
              >
                <div className="h-2 w-2 rounded-full bg-[#84A59D]" />
                <p className="text-sm font-black uppercase tracking-wider text-[#1F2937]">{trans}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* === HERO TO JOURNEY: THE MOCKUP === */}
        {/* On desktop: moves from center to right. On mobile: stays center-top */}
        <motion.div 
          style={isMobile ? { x: "-50%", y: "-40%", scale: 0.85 } : { x: mockupX, y: "-40%", scale: 1 }} 
          className="absolute left-1/2 top-1/2 z-40 transition-transform duration-500 ease-out pointer-events-auto shadow-[0_30px_60px_-15px_rgba(31,41,55,0.15)] rounded-[2.5rem]"
        >
          <JourneyPhonePreview activeIndex={activeIndex} />
        </motion.div>

      </div>


      {/* 
        ========================================================
        SCROLLING LAYER (The Journey Content)
        ========================================================
      */}
      {/* Spacer to push Journey content down past the Hero threshold */}
      <div className="relative z-10 w-full pt-[80vh] md:pt-[100vh] pb-[50vh] pointer-events-auto">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row">
          
          {/* Left Column: Text Points */}
          {/* Mobile adds heavy padding top to avoid overlapping the fixed mockup */}
          <div className="w-full md:w-1/2 relative pt-[40vh] md:pt-0">
            
            {/* Background dashed line */}
            <div className="absolute left-[27px] top-0 bottom-0 w-[2px] bg-[#E5E7EB] border-dashed" />
            
            {/* Animated solid line */}
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
                    className="relative pl-20"
                    onViewportEnter={() => setActiveIndex(index)}
                    viewport={{ margin: isMobile ? "-70% 0px -30% 0px" : "-45% 0px -45% 0px" }}
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
                    <div className="mb-3">
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${isActive ? "text-[#84A59D]" : "text-[#9CA3AF]"}`}>
                        Passo {index + 1}
                      </span>
                    </div>

                    {/* Text Content */}
                    <motion.div
                      animate={{ opacity: isActive ? 1 : 0.3, x: isActive ? 0 : -5 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-sm"
                    >
                      <h3 className="text-2xl md:text-3xl font-display font-black text-[#1F2937] mb-3">
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

          {/* Right Column: Empty space for the sticky mockup on Desktop */}
          <div className="hidden md:block w-1/2" />

        </div>
      </div>
    </div>
  );
}
