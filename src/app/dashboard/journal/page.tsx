"use client";

import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Calendar, CheckSquare, LayoutDashboard, Target, Save, Heart, BookMarked } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function JournalPage() {
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
          <Link href="/dashboard/focus" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-secondary font-medium transition-colors">
            <Calendar className="h-5 w-5" />
            Deep Work
          </Link>
          <Link href="/dashboard/journal" className="flex items-center gap-3 px-4 py-3 rounded-2xl premium-panel border-border text-foreground font-semibold shadow-sm">
            <BookOpen className="h-5 w-5 text-primary" />
            Journal
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col min-h-screen overflow-y-auto">
        <header className="h-20 border-b border-border flex items-center justify-between px-8 md:px-12 bg-card/60 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
             <h1 className="text-2xl font-bold tracking-tight text-foreground">Journal & Gratidão</h1>
          </div>
          <Button variant="default" className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-10 shadow-sm">
             <Save className="h-4 w-4 mr-2" /> Salvar Diário
          </Button>
        </header>

        <div className="p-8 md:p-12 max-w-5xl mx-auto w-full space-y-8 pb-24">
           
           {/* Gratitude Panel */}
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="premium-panel p-8 md:p-12 bg-card relative overflow-hidden">
             
             <div className="flex items-center gap-4 mb-8">
               <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-accent">
                 <Heart className="h-6 w-6" />
               </div>
               <div>
                 <h2 className="text-2xl font-bold tracking-tight text-foreground">Descarrego Positivo</h2>
                 <p className="text-muted-foreground font-medium text-sm">Quais foram as 3 melhores coisas de hoje?</p>
               </div>
             </div>

             <div className="space-y-4">
               {[1, 2, 3].map(item => (
                 <div key={item} className="flex gap-4 items-center">
                   <span className="text-muted-foreground font-mono font-bold text-lg">{item}.</span>
                   <input type="text" placeholder="Escreva aqui..." className="w-full bg-input/50 border border-border h-14 rounded-xl px-4 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                 </div>
               ))}
             </div>
             
             <div className="mt-8">
               <label className="text-sm font-bold text-foreground mb-3 block">Qual foi seu maior aprendizado hoje?</label>
               <textarea rows={4} className="w-full bg-input/50 border border-border rounded-xl p-4 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none" placeholder="O meu maior insight foi..." />
             </div>

           </motion.div>

           {/* Reading Log */}
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="premium-panel p-8 md:p-12 bg-card">
              <div className="flex items-center gap-4 mb-8">
               <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-primary">
                 <BookMarked className="h-6 w-6" />
               </div>
               <div>
                 <h2 className="text-2xl font-bold tracking-tight text-foreground">Registro de Leitura</h2>
                 <p className="text-muted-foreground font-medium text-sm">O que você está absorvendo hoje?</p>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label className="text-sm font-bold text-foreground mb-2 block">Livro Atual</label>
                 <input type="text" placeholder="Ex: Hábitos Atômicos" className="w-full bg-input/50 border border-border h-12 rounded-xl px-4 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
               </div>
               <div>
                 <label className="text-sm font-bold text-foreground mb-2 block">Páginas Lidas / Progresso</label>
                 <input type="text" placeholder="Ex: Cap 4 ou 25 páginas" className="w-full bg-input/50 border border-border h-12 rounded-xl px-4 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
               </div>
             </div>
           </motion.div>

        </div>
      </main>
    </div>
  );
}
