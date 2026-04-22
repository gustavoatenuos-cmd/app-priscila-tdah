"use client";

import { motion } from "framer-motion";
import { BookOpen, Calendar, CheckSquare, LayoutDashboard, Target, Activity, Flame } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="flex bg-background min-h-screen selection:bg-primary/20 text-foreground relative">

      {/* Sidebar - Light Mode Matte */}
      <aside className="w-64 border-r border-border hidden md:block premium-panel rounded-none border-t-0 border-l-0 border-b-0 z-10 relative bg-card">
        <div className="h-20 flex items-center px-8 border-b border-border">
          <span className="font-extrabold text-xl tracking-tight text-foreground">TDAH Constante</span>
        </div>
        
        <nav className="p-4 flex flex-col gap-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-2xl premium-panel border-border text-foreground font-semibold shadow-sm">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            Acompanhamento
          </Link>
          <div className="mt-6 mb-2 px-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Produtividade Real</div>
          <Link href="/dashboard/analytics" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-secondary font-medium transition-colors">
            <Target className="h-5 w-5" />
            Roda da Vida
          </Link>
          <Link href="/dashboard/planner" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-secondary font-medium transition-colors">
            <CheckSquare className="h-5 w-5" />
            Planner TDAH
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground hover:bg-secondary font-medium transition-colors opacity-50 cursor-not-allowed">
            <Calendar className="h-5 w-5" />
            Desafio 365
          </Link>
          <Link href="/dashboard/module/neuroplasticidade" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-secondary font-medium transition-colors">
            <BookOpen className="h-5 w-5" />
            Biblioteca
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col min-h-screen overflow-y-auto">
        <header className="h-20 border-b border-border flex items-center px-8 md:px-12 bg-card/60 backdrop-blur-md sticky top-0 z-30 justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">O seu dia</h1>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 px-4 py-2 premium-panel border-border text-foreground rounded-full text-sm font-bold shadow-sm">
               <Flame className="w-4 h-4 text-orange-500" /> <span className="font-mono text-lg tracking-tight">12 Dias Seguidos</span>
             </div>
          </div>
        </header>

        <div className="p-8 md:p-12 max-w-5xl mx-auto w-full space-y-10 pb-24">
          
          {/* Saudação -> Accompaniment Style */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 premium-panel border-l-4 border-l-primary p-8 md:p-10 relative overflow-hidden bg-card">
            <div className="z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">Bom dia! Pronta para focar?</h2>
              <p className="text-muted-foreground mt-2 max-w-lg leading-relaxed text-lg font-medium">
                O seu cérebro é moldável. Cada pequena ação hoje cria uma ponte para o amanhã. Sem cobranças, apenas constância.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Action Card 1: Module Resume */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="premium-panel premium-hover p-10 flex flex-col group bg-card">
              <div className="h-14 w-14 rounded-2xl bg-secondary text-primary flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Activity className="h-7 w-7" />
              </div>
              <h4 className="font-bold text-2xl mb-3 tracking-tight text-foreground">A Base do Hábito</h4>
              <p className="text-base text-muted-foreground mb-10 flex-1 leading-relaxed font-medium">
                Aprenda as bases científicas e como aplicar os gatilhos certos para mudar seu comportamento de forma duradoura.
              </p>
              <Link href="/dashboard/module/neuroplasticidade">
                <Button className="w-full sm:w-auto rounded-xl px-8 bg-primary hover:bg-primary/90 font-bold text-white transition-all shadow-md">Continuar Curso</Button>
              </Link>
            </motion.div>

            {/* Action Card 2: Daily Planner Prompt */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="premium-panel premium-hover p-10 flex flex-col group relative overflow-hidden bg-card">
              <div className="h-14 w-14 rounded-2xl bg-secondary text-accent flex items-center justify-center mb-8 group-hover:scale-110 transition-transform z-10">
                <Target className="h-7 w-7" />
              </div>
              <h4 className="font-bold text-2xl mb-3 text-foreground tracking-tight z-10">Mova um bloco hoje</h4>
              <p className="text-base text-muted-foreground mb-10 flex-1 leading-relaxed z-10 font-medium">
                Sua lista está limpa. Abra o Planner TDAH e identifique 1 hábito limitante para anotar no descarrego mental hoje.
              </p>
              <Link href="/dashboard/planner" className="z-10">
                <Button className="w-full sm:w-auto bg-foreground hover:bg-foreground/90 font-bold text-white rounded-xl px-8 shadow-md">Abrir Planner</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
