"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/sidebar";
import { Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SOSPage() {
  const [step, setStep] = useState(0);
  const [task, setTask] = useState("");
  const [microSteps, setMicroSteps] = useState<string[]>([]);

  const handleBreakdown = () => {
    // Lógica simples de "quebra" automática ou manual
    // Por enquanto, vamos pedir para o usuário quebrar manualmente
    setStep(2);
  };

  const steps = [
    // 0. Acolhimento
    <motion.div key="intro" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="max-w-2xl text-center">
      <div className="h-20 w-20 bg-[#84A59D]/10 rounded-full flex items-center justify-center mx-auto mb-8">
        <Heart className="h-10 w-10 text-[#84A59D]" />
      </div>
      <h1 className="text-4xl font-black text-[#1F2937] mb-6">Está tudo bem travar.</h1>
      <p className="text-[#64748B] text-xl font-medium mb-4 leading-relaxed">
        Seu cérebro só está precisando de um caminho mais simples agora. Vamos encontrar a primeira peça do quebra-cabeça juntos?
      </p>
      <p className="text-[#9CA3AF] text-sm font-medium mb-10 leading-relaxed max-w-lg mx-auto">
        O SOS é uma ferramenta de neuroplasticidade para vencer a paralisia. Escolha uma única tarefa que está te travando e nós vamos quebrá-la em passos tão pequenos que será impossível não começar.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={() => setStep(1)} className="bg-[#1F2937] text-white px-10 py-5 rounded-[24px] font-bold text-lg shadow-xl shadow-black/10 hover:bg-black transition-all">
          Sim, me ajude a começar
        </button>
        <Link href="/dashboard">
          <button className="bg-white text-[#64748B] px-10 py-5 rounded-[24px] font-bold text-lg border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-all">
            Não consigo agora, só quero descansar
          </button>
        </Link>
      </div>
    </motion.div>,

    // 1. Identificação
    <motion.div key="input" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl w-full">
      <h2 className="text-3xl font-black text-[#1F2937] mb-4">Qual é o grande &quot;monstro&quot; hoje?</h2>
      <p className="text-[#64748B] text-lg font-medium mb-10">Escreva apenas uma coisa que está te dando ansiedade.</p>
      <input 
        type="text" 
        placeholder="Ex: Organizar os documentos da empresa..." 
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="w-full bg-white border-2 border-[#E5E7EB] p-6 rounded-[24px] text-xl font-bold text-[#1F2937] focus:border-[#84A59D] focus:outline-none mb-8"
      />
      <button 
        disabled={!task}
        onClick={handleBreakdown}
        className="w-full bg-[#84A59D] text-white py-6 rounded-[24px] font-bold text-xl shadow-lg shadow-[#84A59D]/20 hover:bg-[#6c8c84] disabled:opacity-30 transition-all flex items-center justify-center gap-3"
      >
        Vamos diminuir isso <Zap className="h-6 w-6" />
      </button>
    </motion.div>,

    // 2. Micro-passos
    <motion.div key="breakdown" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl w-full">
      <h2 className="text-3xl font-black text-[#1F2937] mb-2 text-center italic">&quot;{task}&quot;</h2>
      <h3 className="text-xl font-bold text-[#64748B] mb-12 text-center">é grande demais. Vamos focar apenas no primeiro passo ridículo:</h3>
      
      <div className="space-y-6">
         <MicroStep index={1} text="Abrir a pasta onde estão os arquivos" />
         <MicroStep index={2} text="Apenas olhar para os nomes dos arquivos por 1 minuto" />
         <MicroStep index={3} text="Renomear 1 arquivo apenas" />
      </div>

      <div className="mt-16 flex flex-col items-center">
         <p className="text-[#9CA3AF] font-medium mb-8">Consegue fazer o passo 1 agora?</p>
         <Link href="/dashboard">
            <button className="bg-[#1F2937] text-white px-14 py-6 rounded-[32px] font-bold text-xl shadow-2xl hover:scale-105 transition-all">
              Vou fazer o passo 1! 🚀
            </button>
         </Link>
      </div>
    </motion.div>
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">

        <AnimatePresence mode="wait">
          {steps[step]}
        </AnimatePresence>
    </div>
  );
}

function MicroStep({ index, text }: { index: number, text: string }) {
  return (
    <motion.div 
      whileHover={{ x: 10 }}
      className="bg-white p-6 rounded-[28px] border border-[#E5E7EB] shadow-sm flex items-center gap-6"
    >
      <div className="h-10 w-10 rounded-full bg-[#84A59D]/10 text-[#84A59D] flex items-center justify-center font-black text-lg shrink-0">
        {index}
      </div>
      <span className="text-lg font-bold text-[#1F2937] leading-tight">{text}</span>
    </motion.div>
  );
}
