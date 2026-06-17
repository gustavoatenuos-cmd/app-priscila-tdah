"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Brain, CheckSquare, Target, PenTool, Coffee, Wind } from "lucide-react";
import Link from "next/link";
import { AppLogo } from "@/components/app-logo";
import { useEffect, useState } from "react";

// ── Organic Floating Thoughts ──────────────────────────────────────────────────
const thoughts = [
  { text: "Por onde eu começo?", top: "15%", left: "8%", delay: 0, rotate: -2 },
  { text: "Comecei e parei de novo.", top: "55%", left: "4%", delay: 1.5, rotate: 3 },
  { text: "Tem coisa demais na cabeça.", top: "22%", right: "6%", delay: 0.8, rotate: 2 },
  { text: "Esqueci uma tarefa importante.", top: "65%", right: "8%", delay: 2.2, rotate: -3 },
  { text: "Hoje minha energia está baixa.", top: "80%", left: "25%", delay: 1.2, rotate: 1 },
];

function FloatingThoughts() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none hidden md:block overflow-hidden">
      {thoughts.map((thought, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + i * 0.2, duration: 1 }}
          className="absolute"
          style={{ top: thought.top, left: thought.left, right: thought.right }}
        >
          <motion.div
            animate={{
              y: [0, -12, 0],
              x: [0, 8, 0],
              rotate: [thought.rotate, thought.rotate + 1, thought.rotate - 1, thought.rotate],
            }}
            transition={{
              duration: 7 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: thought.delay,
            }}
            className="bg-white/60 backdrop-blur-md border border-[#84A59D]/20 shadow-sm px-4 py-2 rounded-2xl"
          >
            <p className="text-xs font-medium text-[#64748B] italic">"{thought.text}"</p>
          </motion.div>
        </motion.div>
      ))}

      {/* Organic soft SVG lines connecting loosely */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 100 200 Q 300 50, 500 300 T 900 150" fill="none" stroke="#1F2937" strokeWidth="2" strokeDasharray="5,5" />
        <path d="M 800 500 Q 600 700, 400 400 T 100 600" fill="none" stroke="#1F2937" strokeWidth="2" strokeDasharray="5,5" />
      </svg>
    </div>
  );
}

// ── Mini preview cards that float below the headline ──────────────────────────
const previewCards = [
  {
    icon: Target,
    label: "Top 3 Prioridades",
    items: ["Finalizar relatório base", "Responder email da agência"],
    badge: "1/3 concluída",
    badgeColor: "bg-[#84A59D]/20 text-[#84A59D]",
  },
  {
    icon: Wind,
    label: "Descarrego Mental",
    items: ["Ligar pro dentista", "Comprar ração", "Ideia pro projeto novo..."],
    badge: "Mente mais leve",
    badgeColor: "bg-[#64748B]/10 text-[#64748B]",
  },
  {
    icon: Coffee,
    label: "Plano B do Dia",
    items: ["Apenas o essencial ativado", "Sem culpa hoje"],
    badge: "Modo Proteção",
    badgeColor: "bg-rose-50 text-rose-500",
  },
];

// ── Assistant message bubble ───────────────────────────────────────────────────
function AssistantBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.8 }}
      className="flex items-start gap-3 bg-white/80 backdrop-blur-md border border-[#84A59D]/20 shadow-sm rounded-3xl px-5 py-4 max-w-sm mx-auto"
    >
      <AppLogo className="h-8 w-8 shrink-0 ring-1 ring-[#84A59D]/20" />
      <div>
        <p className="text-[10px] font-black text-[#84A59D] uppercase tracking-widest mb-1">Check-in de Energia</p>
        <p className="text-sm text-[#475569] font-medium leading-snug italic">
          "Sua energia parece baixa agora. Que tal ativarmos o Plano B e fazermos só o mais importante hoje?"
        </p>
      </div>
    </motion.div>
  );
}

// ── App preview card ───────────────────────────────────────────────────────────
function AppPreviewCard({ card, index }: { card: typeof previewCards[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 + index * 0.15, duration: 0.6 }}
      className="bg-white/80 backdrop-blur-xl border border-[#E5E7EB]/50 shadow-sm hover:shadow-md transition-shadow rounded-3xl p-5 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#F5F5F0] rounded-lg">
            <card.icon className="h-4 w-4 text-[#84A59D]" />
          </div>
          <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">{card.label}</span>
        </div>
        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${card.badgeColor}`}>
          {card.badge}
        </span>
      </div>
      <div className="space-y-2 mt-2">
        {card.items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#84A59D]/60 shrink-0" />
            <p className="text-xs font-medium text-[#475569] truncate">{item}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Main Hero ──────────────────────────────────────────────────────────────────
export function HomeHero() {
  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden bg-[#F5F5F0]"
    >
      {/* ── Ambient spotlight glows ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Soft lavender/sage background glows */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#E8F0EE]/60 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[#F3E8E6]/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-[#E8F0EE]/40 rounded-full blur-[120px]" />
      </div>

      <FloatingThoughts />

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col flex-1 container mx-auto px-6 pt-32 lg:pt-40">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#84A59D]/30 bg-white/50 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#84A59D]" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#84A59D]">
              O primeiro app feito para mentes inquietas
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="mt-8 text-center max-w-4xl mx-auto"
        >
          <h1 className="font-display font-black leading-[1.1] tracking-tight text-[#1F2937]" style={{ fontSize: "clamp(2.4rem, 6vw, 4.5rem)" }}>
            Constância possível.<br />
            <span className="text-[#84A59D] font-medium italic">Sem rotinas irreais.</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-6 text-center text-lg md:text-xl text-[#64748B] font-medium max-w-2xl mx-auto leading-relaxed"
        >
          Um espaço seguro para organizar o caos, respeitar sua energia e recomeçar sempre que precisar. Feito com base em neurociência para mulheres com TDAH.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/register">
            <button className="bg-[#1F2937] hover:bg-black text-white px-10 py-4 rounded-[2rem] font-bold text-base shadow-xl shadow-[#1F2937]/10 transition-all flex items-center gap-3 group">
              Começar Gratuitamente
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link href="/login">
            <button className="text-[#64748B] hover:text-[#1F2937] text-sm font-bold uppercase tracking-widest transition-colors">
              Já tenho conta →
            </button>
          </Link>
        </motion.div>

        <p className="mt-4 text-center text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest invisible">
          Espaçador
        </p>

        {/* ── Assistant bubble ── */}
        <div className="mt-12 relative z-20">
          <AssistantBubble />
        </div>

        {/* ── App preview cards (the "second brain" preview) ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 1 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto w-full pb-32 relative z-20"
        >
          {previewCards.map((card, i) => (
            <AppPreviewCard key={i} card={card} index={i} />
          ))}
        </motion.div>
      </div>

    </section>
  );
}
