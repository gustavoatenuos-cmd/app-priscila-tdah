"use client";

import Link from "next/link";
import { ArrowLeft, Brain, Clock } from "lucide-react";

const PREVIEW = [
  { tema: "Dopamina", duracao: "47s", lock: true },
  { tema: "Procrastinação", duracao: "55s", lock: true },
  { tema: "Função executiva", duracao: "1 min", lock: true },
  { tema: "Hiperfoco", duracao: "1 min", lock: true },
  { tema: "Rejeição", duracao: "52s", lock: true },
  { tema: "Sono e TDAH", duracao: "1 min", lock: true },
];

export default function CerebroPage() {
  return (
    <div className="px-6 py-8 md:px-12 lg:max-w-2xl mx-auto pb-32 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard"
          className="h-10 w-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#64748B] hover:text-[#1F2937]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-[#1F2937]">Modo Cérebro</h1>
          <p className="text-xs text-[#9CA3AF]">Pílulas de até 1 minuto.</p>
        </div>
      </div>

      <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-3xl p-6 mb-8 flex items-start gap-3">
        <Brain className="h-5 w-5 text-[#92400E] shrink-0 mt-1" />
        <div>
          <p className="text-sm font-bold text-[#92400E] mb-1">Disponível no Mês 2.</p>
          <p className="text-sm text-[#92400E]/90 leading-relaxed">
            Conteúdos rápidos em vídeo ou áudio para entender por que seu cérebro
            funciona assim. Não é curso, são pílulas. Linguagem simples, direta,
            no tom da Priscilla.
          </p>
        </div>
      </div>

      <p className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] mb-4">
        Prévia dos temas
      </p>
      <div className="grid gap-3">
        {PREVIEW.map((p) => (
          <div
            key={p.tema}
            className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex items-center justify-between opacity-60"
          >
            <div>
              <p className="text-sm font-bold text-[#1F2937]">{p.tema}</p>
              <p className="text-xs text-[#9CA3AF] flex items-center gap-1 mt-0.5">
                <Clock className="h-3 w-3" /> {p.duracao}
              </p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">
              Em breve
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
