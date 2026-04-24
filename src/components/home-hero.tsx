"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function HomeHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-[#F5F5F0]">
      {/* Subtle Background Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#84A59D]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-[#1F2937]/3 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1F2937]/5 rounded-full mb-8">
              <Sparkles className="h-3.5 w-3.5 text-[#84A59D]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1F2937]/60">
                Apoio Prático para Neurodivergentes
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-black text-[#1F2937] leading-[1.1] mb-8 tracking-tight">
              Um sistema de apoio para o <span className="text-[#84A59D]">foco</span> e a <span className="italic">rotina</span> com TDAH.
            </h1>

            <p className="text-xl md:text-2xl text-[#64748B] font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
              Organize sua mente, destrave a paralisia e sustente sua rotina sem a pressão da produtividade tóxica.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <button className="bg-[#1F2937] text-white px-10 py-5 rounded-[2rem] font-bold text-lg shadow-xl shadow-black/10 hover:bg-black transition-all flex items-center gap-3 group">
                  Começar Gratuitamente
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-widest">
                Leva menos de 2 minutos
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Practical Preview - Not a generic dashboard, but a focused UI fragment */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="mt-20 max-w-5xl mx-auto px-6"
      >
        <div className="bg-white rounded-[3rem] p-4 md:p-8 shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/50 relative">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#84A59D]/20 via-[#1F2937]/10 to-[#84A59D]/20 rounded-t-full" />
          <img 
            src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=2072" 
            alt="Interface do TDAH Constante"
            className="w-full rounded-[2rem] shadow-sm grayscale-[20%]"
          />
        </div>
      </motion.div>
    </section>
  );
}
