"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Brain, Zap, CheckSquare, Target } from "lucide-react";
import Link from "next/link";
import { ParticleHero } from "@/components/ui/particle-hero";

// ── Mini preview cards that float below the headline ──────────────────────────
const previewCards = [
  {
    icon: CheckSquare,
    label: "Tarefas Essenciais",
    items: ["Responder e-mail do trabalho", "Pagar conta de luz"],
    badge: "1 concluída",
    badgeColor: "bg-[#84A59D]/20 text-[#84A59D]",
  },
  {
    icon: Brain,
    label: "Esvaziar a Mente",
    items: ["Ligar pro médico", "Comprar remédio", "Lembrar reunião..."],
    badge: "3 pensamentos",
    badgeColor: "bg-[#64748B]/10 text-[#64748B]",
  },
  {
    icon: Target,
    label: "Foco Profundo",
    items: ["▶  24:13 restantes"],
    badge: "Sessão ativa",
    badgeColor: "bg-emerald-50 text-emerald-600",
  },
];

// ── Assistant message bubble ───────────────────────────────────────────────────
function AssistantBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.8 }}
      className="flex items-start gap-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl px-5 py-4 max-w-xs mx-auto"
    >
      <div className="h-8 w-8 bg-[#84A59D] rounded-xl flex items-center justify-center shrink-0">
        <Sparkles className="h-4 w-4 text-white" />
      </div>
      <div>
        <p className="text-[10px] font-black text-[#84A59D] uppercase tracking-widest mb-1">TC Assistant</p>
        <p className="text-sm text-white/70 font-medium leading-snug italic">
          "Parece que você tem energia alta agora. Que tal começar pela tarefa essencial?"
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
      className="bg-white/8 backdrop-blur-xl border border-white/10 rounded-3xl p-5 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <card.icon className="h-4 w-4 text-[#84A59D]" />
          <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">{card.label}</span>
        </div>
        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${card.badgeColor}`}>
          {card.badge}
        </span>
      </div>
      <div className="space-y-2">
        {card.items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#84A59D]/60 shrink-0" />
            <p className="text-xs font-medium text-white/60 truncate">{item}</p>
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
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{
        background: "#05060f",
        backgroundImage: "linear-gradient(180deg, #0a0f1e 0%, #060b16 60%, #0d1a12 100%)",
      }}
    >
      {/* ── Particle canvas ── */}
      <ParticleHero />

      {/* ── Ambient spotlight glows ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Top center glow */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#84A59D]/8 rounded-full blur-[120px]" />
        {/* Bottom left glow */}
        <div className="absolute bottom-0 left-[-5%] w-[500px] h-[400px] bg-[#1F2937]/40 rounded-full blur-[100px]" />
        {/* Spotlight beams */}
        {["-15deg", "15deg", "0deg"].map((deg, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 mx-auto top-0"
            style={{
              borderRadius: "0 0 50% 50%",
              width: "30em",
              height: "42em",
              backgroundImage:
                "conic-gradient(from 0deg at 50% -5%, transparent 45%, rgba(132,165,157,.15) 49%, rgba(132,165,157,.25) 50%, rgba(132,165,157,.15) 51%, transparent 55%)",
              transformOrigin: "50% 0",
              filter: "blur(20px)",
              transform: `rotate(${deg})`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* ── Horizontal accent lines ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {[8, 14, 20, 28].map((top, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-px"
            style={{
              top: `${top}rem`,
              background: "linear-gradient(90deg, transparent, rgba(132,165,157,.12), transparent)",
            }}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col flex-1 container mx-auto px-6">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center pt-40"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#84A59D]/20 bg-[#84A59D]/5">
            <Sparkles className="h-3.5 w-3.5 text-[#84A59D]" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#84A59D]">
              Seu segundo cérebro para TDAH
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
          <h1
            className="font-display font-black leading-[1.1] tracking-tight"
            style={{
              fontSize: "clamp(2.4rem, 6vw, 5rem)",
              background: "linear-gradient(180deg, #e8f4ff 30%, #84A59D 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "none",
            }}
          >
            Organize a mente.
            <br />
            <span style={{ color: "#84A59D", WebkitTextFillColor: "#84A59D" }}>Destrave o dia.</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-6 text-center text-lg md:text-xl text-white/50 font-medium max-w-xl mx-auto leading-relaxed"
        >
          Um assistente pessoal que entende como o seu cérebro funciona — e te ajuda a começar quando parece impossível.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/register">
            <button className="bg-[#84A59D] hover:bg-[#6b9188] text-white px-10 py-4 rounded-[2rem] font-bold text-base shadow-2xl shadow-[#84A59D]/20 transition-all flex items-center gap-3 group">
              Começar Gratuitamente
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link href="/login">
            <button className="text-white/40 hover:text-white/70 text-sm font-bold uppercase tracking-widest transition-colors">
              Já tenho conta →
            </button>
          </Link>
        </motion.div>

        <p className="mt-4 text-center text-[10px] font-bold text-white/20 uppercase tracking-widest">
          Sem cartão de crédito · Leva menos de 2 minutos
        </p>

        {/* ── Assistant bubble ── */}
        <div className="mt-12">
          <AssistantBubble />
        </div>

        {/* ── App preview cards (the "second brain" preview) ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 1 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto w-full pb-20"
        >
          {previewCards.map((card, i) => (
            <AppPreviewCard key={i} card={card} index={i} />
          ))}
        </motion.div>
      </div>

      {/* ── Bottom fade to next section ── */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 z-10"
        style={{
          background: "linear-gradient(to bottom, transparent, #F5F5F0)",
        }}
      />
    </section>
  );
}
