"use client";

import { AppLogo } from "@/components/app-logo";
import { motion } from "framer-motion";
import { Brain, CheckCircle2, Focus, Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

const supportItems = [
  {
    icon: Focus,
    title: "Um passo por vez",
    text: "Organize o agora sem transformar sua rotina em cobranca.",
  },
  {
    icon: Brain,
    title: "Sua mente em contexto",
    text: "O sistema aprende seu ritmo para oferecer apoio mais util.",
  },
  {
    icon: CheckCircle2,
    title: "Progresso possivel",
    text: "Retome de onde parou, mesmo nos dias de energia mais baixa.",
  },
];

export function AuthShell({ eyebrow, title, description, children }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[#F5F5F0] text-[#1F2937]">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,0.9fr)_minmax(520px,1.1fr)]">
        <section className="relative hidden overflow-hidden bg-[#101722] px-10 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "linear-gradient(rgba(132,165,157,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(132,165,157,.15) 1px, transparent 1px)",
              backgroundSize: "52px 52px",
            }}
          />
          <div className="pointer-events-none absolute left-10 top-32 h-px w-40 bg-[#84A59D]" />
          <div className="pointer-events-none absolute bottom-36 right-0 h-56 w-2 bg-[#84A59D]" />

          <Link href="/" className="relative z-10 flex w-fit items-center gap-3">
            <AppLogo className="h-11 w-11 ring-1 ring-white/20" />
            <span className="font-display text-lg font-black">TDAH CONSTANTE</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-lg"
          >
            <div className="mb-7 flex items-center gap-2 text-[#A9C5BE]">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">
                Acolhimento com estrutura
              </span>
            </div>
            <h2 className="font-display text-5xl font-black leading-[1.05]">
              Um lugar para sua mente respirar e continuar.
            </h2>
            <p className="mt-6 max-w-md text-base font-medium leading-7 text-white/60">
              Entre no seu espaco de apoio diario e encontre clareza sem precisar
              estar perfeita para comecar.
            </p>

            <div className="mt-12 space-y-5">
              {supportItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#84A59D]/30 bg-[#84A59D]/10 text-[#A9C5BE]">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-black">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-white/50">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <p className="relative z-10 text-xs font-semibold text-white/35">
            Feito para mentes inquietas. No seu ritmo.
          </p>
        </section>

        <section className="relative flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:px-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at center, rgba(132,165,157,.18) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          />

          <div className="relative z-10 w-full max-w-lg">
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <Link href="/" className="flex items-center gap-3">
                <AppLogo className="h-10 w-10 ring-1 ring-[#D7E1DE]" />
                <span className="font-display text-sm font-black">TDAH CONSTANTE</span>
              </Link>
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#84A59D]">
                No seu ritmo
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-[#73938C]">
                {eyebrow}
              </p>
              <h1 className="font-display text-3xl font-black leading-tight sm:text-4xl">
                {title}
              </h1>
              <p className="mt-3 max-w-md text-sm font-medium leading-6 text-[#64748B] sm:text-base">
                {description}
              </p>
              <div className="mt-7 border-t border-[#DCE4E2] pt-7">{children}</div>
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}
