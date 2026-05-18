"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F5F0] font-sans">
      <nav className="sticky top-0 bg-[#F5F5F0]/90 backdrop-blur-md border-b border-[#E5E7EB]/50 z-40 px-6 md:px-12 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 bg-[#84A59D]/20 border border-[#84A59D]/30 rounded-xl flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-[#84A59D]" />
          </div>
          <span className="text-lg font-display font-black tracking-tight text-[#1F2937]">TDAH CONSTANTE</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#64748B] hover:text-[#1F2937] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar
        </Link>
      </nav>

      <main className="container mx-auto px-6 md:px-12 py-16 max-w-3xl">
        <div className="prose prose-slate max-w-none">{children}</div>

        <div className="mt-20 pt-10 border-t border-[#E5E7EB] flex flex-col md:flex-row gap-4 justify-between text-xs font-bold uppercase tracking-widest text-[#9CA3AF]">
          <div className="flex flex-wrap gap-6">
            <Link href="/legal/privacidade" className="hover:text-[#1F2937]">Privacidade</Link>
            <Link href="/legal/termos" className="hover:text-[#1F2937]">Termos de Uso</Link>
            <Link href="/legal/disclaimer" className="hover:text-[#1F2937]">Aviso clínico</Link>
            <Link href="/legal/exclusao" className="hover:text-[#1F2937]">Excluir minha conta</Link>
          </div>
          <span>© 2026 TDAH Constante</span>
        </div>
      </main>
    </div>
  );
}
