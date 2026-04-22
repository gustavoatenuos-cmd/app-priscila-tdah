"use client";

import { motion } from "framer-motion";
import { BookOpen, Calendar, CheckSquare, LayoutDashboard, Settings, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const stats = [
    { name: "Dias Concluídos", value: "12/365", icon: Calendar },
    { name: "Módulos Lidos", value: "3", icon: BookOpen },
    { name: "Tarefas TDAH", value: "5/8", icon: CheckSquare },
  ];

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      {/* Sidebar Overlay (Mobile) */}
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r flex flex-col">
        <div className="h-16 flex items-center px-6 border-b font-bold text-lg tracking-tight">
          Neuro<span className="text-primary">Mente</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium">
            <LayoutDashboard className="h-5 w-5" />
            Visão Geral
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted font-medium transition-colors">
            <Calendar className="h-5 w-5" />
            Desafio 365
          </Link>
          <Link href="/dashboard/planner" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted font-medium transition-colors">
            <CheckSquare className="h-5 w-5" />
            Planner TDAH
          </Link>
          <Link href="/dashboard/module" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted font-medium transition-colors">
            <BookOpen className="h-5 w-5" />
            Neuromassa
          </Link>
        </nav>
        <div className="p-4 border-t">
          <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted font-medium transition-colors">
            <Settings className="h-5 w-5" />
            Ajustes
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 border-b bg-card flexItems-center justify-between px-6 flex items-center">
          <h1 className="text-xl font-semibold">Visão Geral</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
          {/* Welcome Banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/5 border border-primary/20 rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-2xl font-bold mb-2">Bem-vinda de volta, Priscila!</h2>
              <p className="text-muted-foreground mb-6">
                Você tem 3 tarefas do Planner do TDAH pendentes hoje. Vamos reorganizar a casa interna?
              </p>
              <Button>Ir para o Planner</Button>
            </div>
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick Access to PDFs Modules */}
          <h3 className="text-lg font-semibold mt-8 mb-4">Conteúdo Liberado</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border rounded-2xl p-6 flex flex-col">
              <h4 className="font-bold text-lg mb-2">A mágica da neuroplasticidade</h4>
              <p className="text-sm text-muted-foreground mb-6 flex-1">
                Aprenda as bases científicas e como aplicar os gatilhos certos para mudar seu comportamento de forma duradoura.
              </p>
              <Link href="/dashboard/module">
                <Button variant="outline">Continuar Leitura</Button>
              </Link>
            </div>
            <div className="bg-card border rounded-2xl p-6 flex flex-col border-primary/20 bg-primary/5">
              <h4 className="font-bold text-lg mb-2 text-primary">Desafio de Hoje (Dia 13)</h4>
              <p className="text-sm text-foreground/80 mb-6 flex-1">
                Identifique 3 hábitos limitantes e escreva no papel o caminho de recompensa associado a eles.
              </p>
              <Link href="/dashboard/planner">
                <Button>Completar Desafio</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
