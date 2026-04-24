"use client";

import { Hero195 } from "@/components/ui/hero-195";
import { Testimonials } from "@/components/ui/testimonials-columns-1";
import { AppStoreButton, GooglePlayButton } from "@/components/ui/app-store-button";
import PricingSection from "@/components/ui/pricing-section-4";
import { motion } from "framer-motion";
import { Zap, Target, Brain, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F0] overflow-x-hidden">
      {/* Navbar Minimalista */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/60 backdrop-blur-md border-b border-[#E5E7EB] z-50 px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-[#1F2937] rounded-lg"></div>
          <span className="text-lg font-black tracking-tighter text-[#1F2937]">TDAH CONSTANTE</span>
        </div>
        <div className="flex items-center gap-8">
           <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-[#64748B] hover:text-[#1F2937] transition-colors">Entrar</Link>
           <Link href="/register">
              <button className="bg-[#1F2937] text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Começar</button>
           </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero195 />

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={Brain} 
              title="Descarrego Mental" 
              description="Limpe o excesso de pensamentos e reduza a ansiedade instantaneamente com nosso método de 'brain dump' guiado."
            />
            <FeatureCard 
              icon={Target} 
              title="Zona de Fluxo" 
              description="Um timer projetado para neurodivergentes. Com 'Thought Sandbox' para estacionar distrações sem perder o ritmo."
            />
            <FeatureCard 
              icon={Zap} 
              title="Método 1-2-3" 
              description="A estrutura de priorização que finalmente funciona. 1 essencial, 2 importantes e 3 opcionais. Sem sobrecarga."
            />
          </div>
        </div>
      </section>

      {/* Mobile App Teaser */}
      <section className="py-24 bg-[#1F2937] text-white overflow-hidden relative">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 text-center md:text-left">
             <span className="text-[10px] font-black uppercase tracking-widest text-[#84A59D] mb-4 block">Em Breve</span>
             <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 uppercase leading-tight">
                SEU CÉREBRO <br /> NO SEU BOLSO.
             </h2>
             <p className="text-lg text-white/60 font-medium mb-12 max-w-xl">
                Estamos finalizando a experiência mobile para que a constância te acompanhe em qualquer lugar. Seja notificado no lançamento.
             </p>
             <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <AppStoreButton />
                <GooglePlayButton />
             </div>
          </div>
          <div className="flex-1 relative">
             <div className="bg-white/5 rounded-[48px] p-8 backdrop-blur-3xl border border-white/10 relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=2070" 
                  alt="Mobile Mockup" 
                  className="rounded-[32px] shadow-2xl"
                />
             </div>
             <div className="absolute -top-20 -right-20 h-64 w-64 bg-[#84A59D]/20 rounded-full blur-[100px]" />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Final */}
      <section className="py-32 text-center bg-white border-t border-[#E5E7EB]">
         <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-[#1F2937] mb-8 uppercase">PRONTO PARA A CONSTÂNCIA?</h2>
            <p className="text-xl text-[#64748B] font-medium mb-12 max-w-2xl mx-auto italic">"A constância não é sobre perfeição, é sobre não desistir do seu próximo eu."</p>
            <Link href="/register">
              <button className="bg-[#1F2937] text-white px-12 py-6 rounded-[32px] font-black text-xl shadow-2xl flex items-center gap-4 mx-auto hover:scale-105 transition-all">
                CRIAR MINHA CONTA <ArrowRight className="h-6 w-6" />
              </button>
            </Link>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#E5E7EB] bg-[#F5F5F0]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">© 2026 TDAH CONSTANTE. FEITO PARA MENTES INQUIETAS.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-10 rounded-[40px] border border-[#E5E7EB] bg-white shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
      <div className="h-16 w-16 bg-[#F5F5F0] rounded-2xl flex items-center justify-center text-[#1F2937] mb-8 group-hover:bg-[#1F2937] group-hover:text-white transition-colors">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-black text-[#1F2937] uppercase tracking-tight mb-4">{title}</h3>
      <p className="text-[#64748B] font-medium leading-relaxed">{description}</p>
    </div>
  );
}
