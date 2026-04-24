"use client";

import { motion } from "framer-motion";
import { Brain, Target, CheckSquare, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Esvaziar a Mente",
    description: "Um refúgio para despejar pensamentos invasivos. Tire o ruído da cabeça e transforme o caos em uma lista processável, sem julgamentos.",
    tag: "Clareza Imediata"
  },
  {
    icon: Target,
    title: "Foco Profundo",
    description: "Um timer projetado para mentes inquietas. Estacione distrações na 'Thought Sandbox' e mantenha o ritmo sem perder o foco no que importa.",
    tag: "Zona de Fluxo"
  },
  {
    icon: CheckSquare,
    title: "Priorização 1-2-3",
    description: "TDAH precisa de limites. Nossa estrutura te ajuda a escolher 1 tarefa essencial, 2 importantes e 3 opcionais. Nada mais.",
    tag: "Baixa Carga Cognitiva"
  }
];

export function HomeFeatures() {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-black text-[#1F2937] mb-6 leading-tight">
            Ferramentas práticas para dias em que a <span className="text-[#84A59D]">mente trava</span>.
          </h2>
          <p className="text-lg text-[#64748B] font-medium max-w-xl">
            Não é sobre ser mais produtivo que os outros. É sobre ter um sistema que entende como o seu cérebro funciona.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 md:p-12 rounded-[3rem] bg-[#F5F5F0]/50 border border-[#E5E7EB]/50 hover:bg-white hover:shadow-2xl hover:shadow-[#1F2937]/5 transition-all duration-500"
            >
              <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-[#1F2937] mb-8 shadow-sm group-hover:bg-[#1F2937] group-hover:text-white transition-all duration-300">
                <feature.icon className="h-7 w-7" />
              </div>
              
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#84A59D] mb-4 block">
                {feature.tag}
              </span>
              
              <h3 className="text-2xl font-display font-black text-[#1F2937] mb-4">
                {feature.title}
              </h3>
              
              <p className="text-[#64748B] font-medium leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
