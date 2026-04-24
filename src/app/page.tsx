"use client";

import { HomeHero } from "@/components/home-hero";
import { HomeFeatures } from "@/components/home-features";
import { HomeSosPreview } from "@/components/home-sos-preview";
import PricingSection from "@/components/ui/pricing-section-4";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Heart } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F0] overflow-x-hidden font-sans">
      {/* Navbar Minimalista */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/60 backdrop-blur-md border-b border-[#E5E7EB] z-50 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-[#1F2937] rounded-xl flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-[#84A59D]" />
          </div>
          <span className="text-xl font-display font-black tracking-tight text-[#1F2937]">TDAH CONSTANTE</span>
        </div>
        <div className="flex items-center gap-8">
           <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-[#64748B] hover:text-[#1F2937] transition-colors">Entrar</Link>
           <Link href="/register">
              <button className="bg-[#1F2937] text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-sm">Começar</button>
           </Link>
        </div>
      </nav>

      {/* 1. Hero: O Acolhimento Prático */}
      <HomeHero />

      {/* 2. O Problema (Contexto Relatável) */}
      <section className="py-24 bg-white border-y border-[#E5E7EB]/50">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#84A59D] mb-6">O custo do silêncio</h3>
            <p className="text-2xl md:text-3xl font-display font-medium text-[#1F2937] leading-relaxed mb-8">
              "Eu sei o que preciso fazer, mas não consigo começar."
            </p>
            <p className="text-lg text-[#64748B] font-medium leading-relaxed">
              O caos mental não é falta de vontade. É falta de um sistema que entenda que sua energia oscila, que o foco é caro e que a paralisia é real. Nós construímos o TDAH Constante para ser esse sistema.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Recursos: A Metodologia */}
      <HomeFeatures />

      {/* 4. SOS: O Destrave em Crise */}
      <HomeSosPreview />

      {/* 5. Preços (Simplificados) */}
      <div className="bg-white">
        <PricingSection />
      </div>

      {/* 6. CTA Final: Empoderamento sem Pressão */}
      <section className="py-32 bg-[#F5F5F0]">
         <div className="container mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto p-12 md:p-24 rounded-[4rem] bg-white shadow-2xl shadow-[#1F2937]/5 border border-[#E5E7EB]/50 relative overflow-hidden">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#84A59D]" />
               
               <Heart className="h-12 w-12 text-[#84A59D] mx-auto mb-8" />
               <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight text-[#1F2937] mb-8 leading-tight">
                  Organize o agora sem se cobrar perfeição.
               </h2>
               <p className="text-xl text-[#64748B] font-medium mb-12 max-w-xl mx-auto leading-relaxed italic">
                 "A constância não é sobre nunca parar, mas sobre ter as ferramentas certas para recomeçar sempre que precisar."
               </p>
               
               <Link href="/register">
                 <button className="bg-[#1F2937] text-white px-12 py-6 rounded-[2.5rem] font-black text-xl shadow-2xl flex items-center gap-4 mx-auto hover:bg-black transition-all">
                   CRIAR MINHA CONTA <ArrowRight className="h-6 w-6" />
                 </button>
               </Link>
               
               <p className="mt-8 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest">
                 Comece seu teste gratuito de 7 dias hoje.
               </p>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-[#E5E7EB] bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className="h-6 w-6 bg-[#1F2937] rounded-lg"></div>
                <span className="text-sm font-display font-black text-[#1F2937] uppercase tracking-wider">TDAH Constante</span>
              </div>
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest italic">Feito para mentes inquietas.</p>
            </div>
            <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">© 2026 TDAH CONSTANTE. TODOS OS DIREITOS RESERVADOS.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
