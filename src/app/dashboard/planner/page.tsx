"use client";

import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Calendar, CheckSquare, LayoutDashboard, Target, Plus, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function PlannerPage() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Revisar Campanha Tráfego Pago", completed: false },
    { id: 2, title: "Alinhamento com Cliente", completed: true },
    { id: 3, title: "Setup Nova Arquitetura", completed: false },
  ]);

  return (
    <div className="flex bg-background min-h-screen text-foreground relative overflow-hidden">
      {/* Sidebar Cloned for Seamless Routing */}
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
          <Link href="/dashboard/planner" className="flex items-center gap-3 px-4 py-3 rounded-2xl premium-panel border-border text-foreground font-semibold shadow-sm">
            <CheckSquare className="h-5 w-5 text-primary" />
            Planner TDAH
          </Link>
          <Link href="/dashboard/focus" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-secondary font-medium transition-colors">
            <Calendar className="h-5 w-5" />
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
        <header className="h-20 border-b border-border flex items-center justify-between px-8 md:px-12 bg-card/60 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors bg-secondary p-2 rounded-full md:hidden">
              <ArrowLeft className="h-5 w-5" />
            </Link>
             <h1 className="text-2xl font-bold tracking-tight text-foreground">Planner Diário</h1>
          </div>
          <Button variant="default" className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-10 shadow-sm">
             <Plus className="h-4 w-4 mr-2" /> Novo Bloco
          </Button>
        </header>

        <div className="p-8 md:p-12 max-w-5xl mx-auto w-full">
           
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Calendar Visual Mockup */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1 space-y-6">
                <div className="premium-panel p-8 bg-card flex flex-col items-center">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6">Abril 2026</h3>
                  <div className="grid grid-cols-7 gap-2 w-full text-center">
                     {["D","S","T","Q","Q","S","S"].map(d => <div key={d} className="text-xs font-bold text-muted-foreground">{d}</div>)}
                     {Array.from({length: 30}).map((_, i) => (
                       <div key={i} className={`h-10 w-full flex items-center justify-center rounded-lg text-sm font-medium ${i===21 ? 'bg-primary text-white shadow-md' : 'text-foreground hover:bg-secondary cursor-pointer transition-colors'}`}>
                         {i + 1}
                       </div>
                     ))}
                  </div>
                </div>
              </motion.div>

              {/* Tasks Checklist */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
                 <div className="premium-panel p-8 bg-card flex flex-col h-full min-h-[500px]">
                   <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">Prioridades do Dia</h2>
                   
                   <div className="flex-1 space-y-3">
                     {tasks.map(task => (
                        <div key={task.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${task.completed ? 'bg-secondary/50 border-transparent opacity-60' : 'bg-card border-border hover:shadow-md'}`} onClick={() => setTasks(tasks.map(t => t.id === task.id ? {...t, completed: !t.completed} : t))}>
                           <div className={`h-6 w-6 rounded-md flex items-center justify-center border-2 transition-colors ${task.completed ? 'bg-accent border-accent text-white' : 'border-muted-foreground/30'}`}>
                              {task.completed && <Check className="h-4 w-4" />}
                           </div>
                           <span className={`font-medium flex-1 text-[15px] ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                             {task.title}
                           </span>
                        </div>
                     ))}
                   </div>
                 </div>
              </motion.div>
           </div>
        </div>
      </main>
    </div>
  );
}
