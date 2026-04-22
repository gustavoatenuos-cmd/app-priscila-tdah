"use client";

import { motion } from "framer-motion";
import { BookOpen, Calendar, CheckSquare, LayoutDashboard, Target, Activity, Flame } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="flex bg-background min-h-screen selection:bg-primary/20 text-foreground relative">
      {/* Immersive bg */}
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Sidebar - TDAH Constante Theme */}
      <aside className="w-64 border-r border-white/5 hidden md:block glass-panel rounded-none border-t-0 border-l-0 border-b-0 z-10 relative">
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <span className="font-extrabold text-xl tracking-tight text-white">TDAH Constante</span>
        </div>
        
        <nav className="p-4 flex flex-col gap-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-2xl glass-panel border-white/10 text-white font-medium shadow-sm">
            <LayoutDashboard className="h-5 w-5" />
            Acompanhamento
          </Link>
          <div className="mt-6 mb-2 px-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Produtividade Real</div>
          <Link href="/dashboard/analytics" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground hover:text-white hover:bg-white/5 font-medium transition-colors">
            <Target className="h-5 w-5" />
            Roda da Vida
          </Link>
          <Link href="/dashboard/planner" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground hover:text-white hover:bg-white/5 font-medium transition-colors">
            <CheckSquare className="h-5 w-5" />
            Planner TDAH
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground hover:bg-muted font-medium transition-colors opacity-50 cursor-not-allowed">
            <Calendar className="h-5 w-5" />
            Desafio 365
          </Link>
          <Link href="/dashboard/module/neuroplasticidade" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground hover:text-white hover:bg-white/5 font-medium transition-colors">
            <BookOpen className="h-5 w-5" />
            Biblioteca
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col min-h-screen overflow-y-auto">
        <header className="h-20 border-b border-white/5 flex items-center px-8 md:px-12 glass-panel rounded-none border-t-0 border-l-0 border-r-0 sticky top-0 z-30 justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-white">O seu dia</h1>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 px-4 py-2 glass-panel border-white/10 text-white rounded-full text-sm font-bold shadow-sm">
               <Flame className="w-4 h-4 text-orange-400" /> <span className="font-mono text-lg tracking-tight">12 Dias Seguidos</span>
             </div>
          </div>
        </header>

        <div className="p-8 md:p-12 max-w-5xl mx-auto w-full space-y-10 pb-24">
          
          {/* Saudação -> Accompaniment Style */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 glass-panel border-l-4 border-l-primary p-8 md:p-10 relative overflow-hidden">
             
            <div className="z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Bom dia! Pronta para focar?</h2>
              <p className="text-muted-foreground mt-2 max-w-lg leading-relaxed text-lg">
                O seu cérebro é moldável. Cada pequena ação hoje cria uma ponte para o amanhã. Sem cobranças, apenas constância.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Action Card 1: Module Resume */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-10 flex flex-col hover:border-white/20 transition-all group">
              <div className="h-14 w-14 rounded-2xl glass-panel border-white/10 text-white flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Activity className="h-7 w-7" />
              </div>
              <h4 className="font-bold text-2xl mb-3 tracking-tight text-white">A Base do Hábito</h4>
              <p className="text-base text-muted-foreground mb-10 flex-1 leading-relaxed">
                Aprenda as bases científicas e como aplicar os gatilhos certos para mudar seu comportamento de forma duradoura.
              </p>
              <Link href="/dashboard/module/neuroplasticidade">
                <Button className="w-full sm:w-auto rounded-xl px-8 glass-panel border-white/10 hover:bg-white/10 font-bold text-white transition-all shadow-md">Continuar Curso</Button>
              </Link>
            </motion.div>

            {/* Action Card 2: Daily Planner Prompt */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-10 flex flex-col hover:border-white/20 transition-all group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-[50px] -mr-10 -mt-10 pointer-events-none" />
              <div className="h-14 w-14 rounded-2xl glass-panel border-white/10 text-white flex items-center justify-center mb-8 group-hover:scale-110 transition-transform z-10">
                <Target className="h-7 w-7" />
              </div>
              <h4 className="font-bold text-2xl mb-3 text-white tracking-tight z-10">Mova um bloco hoje</h4>
              <p className="text-base text-muted-foreground mb-10 flex-1 leading-relaxed z-10">
                Sua lista está limpa. Abra o Planner TDAH e identifique 1 hábito limitante para anotar no descarrego mental hoje.
              </p>
              <Link href="/dashboard/planner" className="z-10">
                <Button className="w-full sm:w-auto glass-panel border-white/10 hover:bg-white/10 font-bold text-white rounded-xl px-8 shadow-md">Abrir Planner</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
