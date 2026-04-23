"use client";

import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Calendar, CheckSquare, LayoutDashboard, Target, Play, Square, Timer } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function FocusPage() {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="flex bg-background min-h-screen text-foreground relative overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border hidden md:block premium-panel rounded-none border-t-0 border-l-0 border-b-0 z-10 relative bg-card">
        <div className="h-20 flex items-center px-8 border-b border-border">
          <span className="font-extrabold text-xl tracking-tight text-foreground">TDAH Constante</span>
        </div>
        <nav className="p-4 flex flex-col gap-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-secondary font-medium transition-colors">
            <LayoutDashboard className="h-5 w-5" />
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
          <Link href="/dashboard/focus" className="flex items-center gap-3 px-4 py-3 rounded-2xl premium-panel border-border text-foreground font-semibold shadow-sm">
            <Calendar className="h-5 w-5 text-primary" />
            Deep Work
          </Link>
          <Link href="/dashboard/journal" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-secondary font-medium transition-colors">
            <BookOpen className="h-5 w-5" />
            Journal
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col min-h-screen">
        <header className="h-20 border-b border-border flex items-center px-8 md:px-12 bg-card/60 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
             <h1 className="text-2xl font-bold tracking-tight text-foreground">Zona de Fluxo (Deep Work)</h1>
          </div>
        </header>

        <div className="p-8 md:p-12 max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
           
           <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center w-full max-w-lg">
             <div className="premium-panel p-16 bg-card flex flex-col items-center w-full relative overflow-hidden">
                <div className="absolute top-4 left-4 h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center">
                   <Target className="h-3 w-3 text-accent" />
                </div>
                
                <h3 className="text-sm font-bold text-muted-foreground tracking-widest uppercase mb-12">Otimização de Campanhas</h3>
                
                {/* Giant Timer */}
                <div className="text-[100px] md:text-[140px] font-mono leading-none tracking-tighter text-foreground mb-16 flex items-center tabular-nums">
                  50<span className="text-muted opacity-50 mx-2 animate-pulse">:</span>00
                </div>

                {/* Controls */}
                <div className="flex items-center gap-6 w-full">
                  {!isRunning ? (
                    <Button onClick={() => setIsRunning(true)} className="flex-1 bg-foreground hover:bg-foreground/90 text-white font-bold h-16 rounded-2xl text-lg shadow-xl shadow-foreground/10 transition-all hover:-translate-y-1">
                      <Play className="h-6 w-6 mr-3" /> Iniciar Foco
                    </Button>
                  ) : (
                    <Button onClick={() => setIsRunning(false)} className="flex-1 bg-accent hover:bg-accent/90 text-white font-bold h-16 rounded-2xl text-lg shadow-xl shadow-accent/10 transition-all hover:-translate-y-1">
                      <Square className="h-6 w-6 mr-3" /> Interromper
                    </Button>
                  )}
                </div>
             </div>
             
             <p className="mt-8 text-muted-foreground font-medium text-center">Tempo total registrado hoje: <span className="font-bold text-foreground">1h 20m</span></p>

           </motion.div>
        </div>
      </main>
    </div>
  );
}
