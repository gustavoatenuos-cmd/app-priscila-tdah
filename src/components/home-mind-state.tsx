"use client";

import { motion } from "framer-motion";
import { ArrowRight, Wind, RotateCcw, Coffee, Heart } from "lucide-react";
import { useState } from "react";

const mindStates = [
  {
    id: "tudo",
    icon: Wind,
    pain: "Tudo ao mesmo tempo.",
    solutionTitle: "Descarrego Mental",
    solutionDesc: "Tire da cabeça sem precisar organizar tudo agora.",
    color: "bg-[#E8F0EE]",
    iconColor: "text-[#84A59D]",
  },
  {
    id: "parei",
    icon: RotateCcw,
    pain: "Comecei, mas parei.",
    solutionTitle: "Recomeço sem culpa",
    solutionDesc: "Volte de onde conseguiu, sem ser punida pelo intervalo.",
    color: "bg-[#F3E8E6]",
    iconColor: "text-[#D4A373]",
  },
  {
    id: "energia",
    icon: Coffee,
    pain: "Lista demais, energia de menos.",
    solutionTitle: "Plano B do Dia",
    solutionDesc: "Reduza o plano para o essencial quando sua energia estiver baixa.",
    color: "bg-[#FDF6E3]",
    iconColor: "text-[#E9C46A]",
  },
  {
    id: "culpa",
    icon: Heart,
    pain: "Culpa por não manter constância.",
    solutionTitle: "Constância Possível",
    solutionDesc: "Acompanhe pequenas vitórias sem transformar rotina em cobrança.",
    color: "bg-[#F0F4F8]",
    iconColor: "text-[#64748B]",
  },
];

export function HomeMindState() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Soft background decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FAF9F6] rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F5F5F0] rounded-full blur-[80px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-black text-[#1F2937] tracking-tight mb-4">
            Sua mente hoje pode estar assim
          </h2>
          <p className="text-lg text-[#64748B] font-medium leading-relaxed">
            Nós não tentamos consertar a sua mente. Nós criamos ferramentas flexíveis para você trabalhar em harmonia com ela. Passe o mouse e veja como funciona:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {mindStates.map((state, i) => (
            <motion.div
              key={state.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              onHoverStart={() => setHoveredCard(state.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative h-64 rounded-3xl p-1 overflow-hidden cursor-pointer group shadow-sm border border-[#E5E7EB] bg-white transition-all duration-500 hover:shadow-xl hover:border-[#84A59D]/30 hover:-translate-y-2"
            >
              {/* Inner container to hold state */}
              <div className="absolute inset-1 rounded-[22px] bg-white overflow-hidden flex flex-col justify-center items-center p-6 text-center z-10 transition-colors duration-500">
                {/* Default Pain State */}
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center p-6 transition-opacity duration-500 ${
                    hoveredCard === state.id ? "opacity-0 scale-95" : "opacity-100 scale-100"
                  }`}
                >
                  <p className="font-display text-xl font-bold text-[#1F2937] leading-tight opacity-80">
                    "{state.pain}"
                  </p>
                  <div className="mt-6 flex flex-col items-center gap-2 opacity-30 group-hover:opacity-0 transition-opacity">
                    <ArrowRight className="h-4 w-4 text-[#1F2937] rotate-90" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#1F2937]">Como resolvemos</span>
                  </div>
                </div>

                {/* Hover App Solution State */}
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center p-6 transition-all duration-500 ${state.color} ${
                    hoveredCard === state.id ? "opacity-100 scale-100" : "opacity-0 scale-105"
                  }`}
                >
                  <div className="p-3 bg-white/50 backdrop-blur-sm rounded-2xl mb-4">
                    <state.icon className={`h-6 w-6 ${state.iconColor}`} strokeWidth={2.5} />
                  </div>
                  <h3 className="font-display text-lg font-black text-[#1F2937] mb-2">
                    {state.solutionTitle}
                  </h3>
                  <p className="text-sm font-medium text-[#475569] leading-relaxed">
                    {state.solutionDesc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
