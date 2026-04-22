"use client";

import { motion } from "framer-motion";
import { BookOpen, Calendar, CheckSquare, LayoutDashboard, Target, Activity, Flame } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="flex bg-background min-h-screen selection:bg-primary/20">
      {/* Sidebar - TDAH Constante Theme */}
      <aside className="w-64 border-r hidden md:block bg-card/40 backdrop-blur-sm z-10 relative">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">TDAH Constante</span>
        </div>
        
        <nav className="p-4 flex flex-col gap-2">
           <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-xl bg-primary/10 text-primary font-medium">
            <LayoutDashboard className="h-5 w-5" />
            Acompanhamento
          </Link>
          <div className="mt-4 mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Suas Ferramentas</div>
          <Link href="/dashboard/planner" className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted font-medium transition-colors">
            <CheckSquare className="h-5 w-5" />
            Planner TDAH
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted font-medium transition-colors opacity-50 cursor-not-allowed">
            <Calendar className="h-5 w-5" />
            Desafio 365
          </Link>
          <Link href="/dashboard/module/neuroplasticidade" className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground hover:bg-muted/50 font-medium transition-colors">
            <BookOpen className="h-5 w-5" />
            Biblioteca
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col min-h-screen overflow-y-auto">
        <header className="h-16 border-b flex items-center px-6 md:px-12 bg-card/60 backdrop-blur-md sticky top-0 z-30 justify-between">
          <h1 className="text-xl font-bold tracking-tight">O seu dia</h1>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-semibold border border-emerald-500/20">
               <Flame className="w-4 h-4" /> 12 Dias Seguidos
             </div>
          </div>
        </header>

        <div className="p-6 md:p-12 max-w-5xl mx-auto w-full space-y-8 pb-24">
          
          {/* Saudação -> Accompaniment Style */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-8 rounded-[2rem] border border-border/50 shadow-sm relative overflow-hidden">
             
            <div className="z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Bom dia! Pronta para focar?</h2>
              <p className="text-muted-foreground mt-2 max-w-lg leading-relaxed">
                O seu cérebro é moldável. Cada pequena ação hoje cria uma ponte para o amanhã. Sem cobranças, apenas constância.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Action Card 1: Module Resume */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border rounded-3xl p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow group">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-xl mb-2 tracking-tight">A Base do Hábito</h4>
              <p className="text-sm text-muted-foreground mb-8 flex-1 leading-relaxed">
                Aprenda as bases científicas e como aplicar os gatilhos certos para mudar seu comportamento de forma duradoura.
              </p>
              <Link href="/dashboard/module/neuroplasticidade">
                <Button variant="outline" className="w-full sm:w-auto rounded-full px-8 hover:bg-primary hover:text-primary-foreground transition-all">Continuar Progresso</Button>
              </Link>
            </motion.div>

            {/* Action Card 2: Daily Planner Prompt */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-8 flex flex-col hover:bg-emerald-500/10 transition-colors group relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] -mr-10 -mt-10" />
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-xl mb-2 text-emerald-600 dark:text-emerald-400 tracking-tight">Mova um bloco hoje</h4>
              <p className="text-sm text-muted-foreground mb-8 flex-1 leading-relaxed">
                Sua lista está limpa. Abra o Planner TDAH e identifique 1 hábito limitante para anotar no descarrego mental hoje.
              </p>
              <Link href="/dashboard/planner">
                <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 shadow-md shadow-emerald-500/20">Abrir Planner</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
