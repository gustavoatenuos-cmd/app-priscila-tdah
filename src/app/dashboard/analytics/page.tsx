"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Target, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  const [data, setData] = useState([
    { subject: "Foco", A: 80, fullMark: 100 },
    { subject: "Rotina", A: 65, fullMark: 100 },
    { subject: "Saúde", A: 90, fullMark: 100 },
    { subject: "Lazer", A: 50, fullMark: 100 },
    { subject: "Mindset", A: 75, fullMark: 100 },
    { subject: "Estudos", A: 85, fullMark: 100 },
  ]);

  return (
    <div className="flex bg-background min-h-screen text-foreground relative overflow-hidden">
      {/* Main Container */}
      <main className="flex-1 w-full flex flex-col min-h-screen">
        <header className="h-20 border-b border-border flex items-center justify-between px-8 md:px-16 premium-panel rounded-none border-t-0 border-l-0 border-r-0 sticky top-0 z-50 bg-card">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors bg-secondary p-2 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics & Roda da Vida</h1>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Sincronizado na Nuvem</p>
            </div>
          </div>
          <Button variant="outline" className="border-border hover:bg-secondary font-bold text-foreground">
            <Zap className="h-4 w-4 mr-2 text-primary" />
            Atualizar Dados
          </Button>
        </header>

        <div className="p-8 md:p-16 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Radar Chart Panel */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 premium-panel premium-hover p-8 md:p-12 min-h-[500px] flex flex-col relative bg-card"
          >
            <div className="flex justify-between items-start mb-8">
               <div>
                 <h2 className="text-3xl font-bold tracking-tight text-foreground">Equilíbrio Central</h2>
                 <p className="text-muted-foreground mt-2 font-medium">Visão analítica dos 6 pilares de performance da sua semana.</p>
               </div>
               <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center border-border border">
                 <Target className="h-6 w-6 text-primary" />
               </div>
            </div>

            <div className="flex-1 w-full min-h-[400px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#333333', fontSize: 13, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', color: '#333333', border: '1px solid #E5E7EB', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
                     itemStyle={{ color: '#333333', fontWeight: 'bold' }}
                  />
                  <Radar 
                    name="Performance Atual" 
                    dataKey="A" 
                    stroke="#64748B" 
                    strokeWidth={3}
                    fill="#64748B" 
                    fillOpacity={0.15} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Quick Metrics */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="premium-panel p-6 border-l-4 border-l-primary bg-card"
            >
              <h4 className="text-sm text-muted-foreground font-bold uppercase tracking-widest mb-2">Melhor Índice</h4>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-mono font-extrabold text-foreground tracking-tighter">Saúde</span>
                <span className="text-lg text-primary font-bold mb-1 flex items-center"><TrendingUp className="h-4 w-4 mr-1"/> 90/100</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="premium-panel p-6 border-l-4 border-l-accent bg-card"
            >
              <h4 className="text-sm text-muted-foreground font-bold uppercase tracking-widest mb-2">Ponto de Atenção</h4>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-mono font-extrabold text-foreground tracking-tighter">Lazer</span>
                <span className="text-lg text-accent font-bold mb-1 flex items-center">50/100</span>
              </div>
            </motion.div>

             <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="premium-panel premium-hover p-6 bg-card"
            >
              <h4 className="text-sm text-foreground font-bold mb-2">Simulação Rápida</h4>
              <p className="text-sm text-muted-foreground mb-4 font-medium">Adicione +10 pontos em Foco e Lazer para ver o gráfico expandir ao vivo.</p>
              <Button 
                className="w-full bg-foreground hover:bg-foreground/90 text-white font-bold h-12 rounded-xl"
                onClick={() => {
                  setData(prev => prev.map(d => 
                    (d.subject === "Foco" || d.subject === "Lazer") 
                      ? { ...d, A: Math.min(100, d.A + 10) } 
                      : d
                  ))
                }}
              >
                Injetar Progresso
              </Button>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
