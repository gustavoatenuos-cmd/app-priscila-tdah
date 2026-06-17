"use client";

import { HomeEditorialJourney } from "@/components/home-editorial-journey";
import { HomeMindState } from "@/components/home-mind-state";
import { HomeFeatures } from "@/components/home-features";
import { HomeHero } from "@/components/home-hero";
import { HomeSosPreview } from "@/components/home-sos-preview";
import { AppLogo } from "@/components/app-logo";
import PricingSection from "@/components/ui/pricing-section-4";
import { ArrowRight, Heart } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F0] overflow-x-hidden font-sans">
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/50 backdrop-blur-md z-50 px-8 flex items-center justify-between transition-all border-b border-[#E5E7EB]/50">
        <div className="flex items-center gap-3">
          <AppLogo className="h-10 w-10 ring-2 ring-[#84A59D]/20" />
          <span className="text-xl font-display font-black tracking-tight text-[#1F2937]">TDAH CONSTANTE</span>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-[#64748B] hover:text-[#1F2937] transition-colors">Entrar</Link>
          <Link href="/register">
            <button className="border border-[#84A59D]/40 bg-[#84A59D]/10 text-[#84A59D] px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#84A59D] hover:text-white transition-all shadow-sm">Começar</button>
          </Link>
        </div>
      </nav>

      <HomeHero />

      <HomeEditorialJourney />

      <HomeMindState />

      <HomeFeatures />
      
      <HomeSosPreview />

      <div className="bg-white">
        <PricingSection />
      </div>

      <section className="py-32 bg-[#F5F5F0]">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto p-12 md:p-24 rounded-[4rem] bg-white shadow-2xl shadow-[#1F2937]/5 border border-[#E5E7EB]/50 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#84A59D]" />
            <Heart className="h-12 w-12 text-[#84A59D] mx-auto mb-8" />
            <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight text-[#1F2937] mb-8 leading-tight">
              Organize o agora sem se cobrar perfeição.
            </h2>
            <p className="text-xl text-[#64748B] font-medium mb-12 max-w-xl mx-auto leading-relaxed italic">
              &quot;A constância não é sobre nunca parar, mas sobre ter as ferramentas certas para recomeçar sempre que precisar.&quot;
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

      <footer className="py-20 border-t border-[#E5E7EB] bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <AppLogo className="h-8 w-8 ring-1 ring-[#E5E7EB]" />
                <span className="text-sm font-display font-black text-[#1F2937] uppercase tracking-wider">TDAH Constante</span>
              </div>
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest italic">Feito para mentes inquietas.</p>
            </div>
            <div className="flex flex-col md:items-end gap-3">
              <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#9CA3AF]">
                <Link href="/legal/privacidade" className="hover:text-[#1F2937]">Privacidade</Link>
                <Link href="/legal/termos" className="hover:text-[#1F2937]">Termos</Link>
                <Link href="/legal/disclaimer" className="hover:text-[#1F2937]">Aviso clínico</Link>
                <Link href="/legal/exclusao" className="hover:text-[#1F2937]">Excluir conta</Link>
              </div>
              <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">© 2026 TDAH CONSTANTE. TODOS OS DIREITOS RESERVADOS.</p>
              <p className="text-[10px] text-[#9CA3AF] italic max-w-md text-center md:text-right">
                Ferramenta de apoio comportamental e educacional. Não substitui acompanhamento médico, psicológico ou psiquiátrico.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
