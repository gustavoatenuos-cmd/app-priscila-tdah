"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Check, Plus, Square } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function PlannerPage() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Revisar agenda semanal", done: false },
    { id: 2, text: "Beber 2L de água", done: true },
    { id: 3, text: "Leitura de 15 minutos (Neuroplasticidade)", done: false },
    { id: 4, text: "Desafio 365: Meditação rápida", done: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card h-16 flex items-center px-6">
        <Link href="/dashboard" className="mr-6 flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5 mr-2" /> Voltar
        </Link>
        <h1 className="text-xl font-bold">Planner Interativo do TDAH</h1>
      </header>
      
      <main className="p-6 md:p-12 max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-3">Sua Rotina, Simplificada.</h2>
          <p className="text-muted-foreground">
            Buscamos transformar as atividades que exaurem mentes neurodivergentes em micrometas prazerosas.
          </p>
        </div>

        <div className="bg-card border rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Micro-Tarefas de Hoje</h3>
            <Button variant="secondary" size="sm"><Plus className="h-4 w-4 mr-1"/> Adicionar</Button>
          </div>

          <div className="space-y-3">
            {tasks.map((task, i) => (
              <motion.div 
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer",
                  task.done ? "bg-primary/5 border-primary/20" : "hover:border-primary/50"
                )}
                onClick={() => toggleTask(task.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex-shrink-0 h-6 w-6 rounded-md flex items-center justify-center border",
                    task.done ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30"
                  )}>
                    {task.done && <Check className="h-4 w-4" />}
                  </div>
                  <span className={cn("font-medium transition-colors", task.done && "line-through text-muted-foreground")}>
                    {task.text}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-3xl p-6 mt-8">
          <h3 className="font-bold text-primary mb-2">Descarrego Mental</h3>
          <p className="text-sm text-muted-foreground mb-4">Área livre para você digitar o que está processando na sua mente antes de organizar em tarefas.</p>
          <textarea 
            className="w-full bg-background border rounded-xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            placeholder="Comece a digitar aqui..."
          ></textarea>
        </div>
      </main>
    </div>
  );
}
