"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/ui/border-beam";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card-premium";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Zap, 
  Target, 
  Brain, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  LayoutDashboard,
  BarChart3,
  Calendar,
  MessageSquare
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

const data = [
  { name: "Seg", focus: 40 },
  { name: "Ter", focus: 30 },
  { name: "Qua", focus: 65 },
  { name: "Qui", focus: 45 },
  { name: "Sex", focus: 80 },
  { name: "Sáb", focus: 55 },
  { name: "Dom", focus: 90 },
];

export function Hero195() {
  return (
    <section className="relative min-h-screen bg-[#F5F5F0] overflow-hidden py-24 md:py-32">
      <TracingBeam className="px-6">
        <div className="max-w-6xl mx-auto antialiased pt-4 relative">
          
          {/* Header Area */}
          <div className="flex flex-col items-center text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black uppercase tracking-widest bg-[#84A59D]/10 text-[#84A59D] rounded-full border border-[#84A59D]/20">
                Ecossistema de Alto Desempenho TDAH
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-6xl md:text-8xl font-black tracking-tighter text-[#1F2937] mb-8 leading-[0.85] uppercase"
            >
              Arquitetura <br /> 
              <span className="text-[#84A59D]">da Constância.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-[#64748B] font-medium mb-12 max-w-2xl leading-relaxed"
            >
              Vá além do planejamento. Construímos um sistema robusto de suporte cognitivo 
              que transforma o caos em fluxos previsíveis de produtividade e foco.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <Link href="/register">
                <Button size="lg" className="bg-[#1F2937] text-white px-12 rounded-2xl font-black text-xl h-18 shadow-2xl hover:scale-105 transition-all">
                  INICIAR JORNADA
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-2 border-[#1F2937] text-[#1F2937] px-12 rounded-2xl font-black text-xl h-18 hover:bg-[#1F2937]/5 transition-all">
                  ENTRAR NO APP
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Robust Dashboard Teaser Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <Card className="border-4 border-[#1F2937] rounded-[48px] overflow-hidden bg-white shadow-[0_50px_100px_rgba(0,0,0,0.1)] p-2">
              <BorderBeam size={600} duration={15} />
              
              <div className="bg-[#F9FAFB] rounded-[40px] overflow-hidden border border-[#E5E7EB]">
                {/* Internal Mockup Dashboard Navigation */}
                <div className="h-16 border-b border-[#E5E7EB] bg-white px-8 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                    </div>
                    <div className="h-6 w-px bg-[#E5E7EB]"></div>
                    <div className="flex gap-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#1F2937]">Dashboard</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">Focus</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">Planner</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-[#E5E7EB]"></div>
                  </div>
                </div>

                <div className="p-8">
                  <Tabs defaultValue="overview" className="w-full">
                    <div className="flex items-center justify-between mb-8">
                      <TabsList className="bg-white border rounded-xl p-1">
                        <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-[#1F2937] data-[state=active]:text-white">Visão Geral</TabsTrigger>
                        <TabsTrigger value="analytics" className="rounded-lg">Analítico</TabsTrigger>
                        <TabsTrigger value="history" className="rounded-lg">Histórico</TabsTrigger>
                      </TabsList>
                      <div className="flex gap-2">
                         <div className="h-9 px-4 rounded-xl bg-[#84A59D] text-white flex items-center justify-center text-[10px] font-black uppercase tracking-widest cursor-pointer shadow-lg shadow-[#84A59D]/20">
                           +500 PONTOS
                         </div>
                      </div>
                    </div>

                    <TabsContent value="overview" className="mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <StatsCard icon={Zap} label="Foco Total" value="12.5h" trend="+15%" color="bg-blue-500" />
                        <StatsCard icon={CheckCircle2} label="Tarefas" value="48" trend="+20%" color="bg-[#84A59D]" />
                        <StatsCard icon={TrendingUp} label="Consistência" value="85%" trend="+5%" color="bg-orange-500" />
                        <StatsCard icon={Clock} label="Nível Atual" value="12" trend="Top 1%" color="bg-[#1F2937]" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-2 rounded-3xl p-6 border-none shadow-sm bg-white">
                          <CardHeader className="p-0 mb-6">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-[#1F2937]">Curva de Performance Semanal</CardTitle>
                          </CardHeader>
                          <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={data}>
                                <defs>
                                  <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#84A59D" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#84A59D" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <XAxis dataKey="name" hide />
                                <YAxis hide />
                                <Tooltip 
                                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                  labelStyle={{ fontWeight: '900', color: '#1F2937' }}
                                />
                                <Area type="monotone" dataKey="focus" stroke="#84A59D" strokeWidth={4} fillOpacity={1} fill="url(#colorFocus)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </Card>

                        <div className="space-y-6">
                           <ActivityItem icon={Target} title="Pomodoro Mestre" time="há 2h" desc="25min de foco profundo." />
                           <ActivityItem icon={Brain} title="Descarrego Mental" time="há 4h" desc="12 itens priorizados." />
                           <ActivityItem icon={TrendingUp} title="Novo Nível" time="Ontem" desc="Você atingiu o nível 12!" />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </Card>

            {/* Floating UI Elements for Complexity */}
            <div className="absolute -top-12 -right-12 hidden lg:block z-20">
               <motion.div
                 animate={{ y: [0, -10, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               >
                 <Card className="p-6 rounded-[32px] shadow-2xl border-none bg-white">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-[#84A59D]/10 flex items-center justify-center text-[#84A59D]">
                         <BarChart3 className="h-6 w-6" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">Produtividade</p>
                         <p className="text-lg font-black text-[#1F2937]">+240%</p>
                      </div>
                   </div>
                 </Card>
               </motion.div>
            </div>

            <div className="absolute -bottom-12 -left-12 hidden lg:block z-20">
               <motion.div
                 animate={{ y: [0, 10, 0] }}
                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               >
                 <Card className="p-6 rounded-[32px] shadow-2xl border-none bg-white">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500">
                         <Clock className="h-6 w-6" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">Tempo Salvo</p>
                         <p className="text-lg font-black text-[#1F2937]">4h 20m</p>
                      </div>
                   </div>
                 </Card>
               </motion.div>
            </div>
          </motion.div>

          {/* Grid of Features Below */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-40 mb-20">
             <FeatureItem 
               icon={LayoutDashboard} 
               title="Hub Cognitivo" 
               desc="Centralize tudo em um dashboard analítico projetado para reduzir a carga mental." 
             />
             <FeatureItem 
               icon={Calendar} 
               title="Agenda Fluida" 
               desc="Visualização calendarizada do seu histórico de conquistas e evolução." 
             />
             <FeatureItem 
               icon={MessageSquare} 
               title="Suporte SOS" 
               desc="IA treinada para te tirar de crises de paralisia e inércia em segundos." 
             />
             <FeatureItem 
               icon={Zap} 
               title="Gamificação Real" 
               desc="Um sistema de recompensas que realmente fala a língua da sua dopamina." 
             />
          </div>

        </div>
      </TracingBeam>
    </section>
  );
}

function StatsCard({ icon: Icon, label, value, trend, color }: { icon: any, label: string, value: string, trend: string, color: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-all border border-[#E5E7EB]/50">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center text-white", color)}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-[10px] font-black text-[#84A59D] bg-[#84A59D]/10 px-2 py-0.5 rounded-full">{trend}</span>
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] mb-1">{label}</p>
      <p className="text-2xl font-black text-[#1F2937]">{value}</p>
    </div>
  );
}

function ActivityItem({ icon: Icon, title, time, desc }: { icon: any, title: string, time: string, desc: string }) {
  return (
    <div className="flex gap-4 items-start bg-white p-5 rounded-2xl border border-[#E5E7EB]/50 hover:border-[#84A59D]/30 transition-all">
      <div className="h-10 w-10 shrink-0 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-[#1F2937]">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-[11px] font-black uppercase tracking-tight text-[#1F2937]">{title}</h4>
          <span className="text-[8px] font-bold text-[#9CA3AF] uppercase">{time}</span>
        </div>
        <p className="text-[10px] text-[#64748B] font-medium leading-tight">{desc}</p>
      </div>
    </div>
  );
}

function FeatureItem({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="space-y-4 group">
      <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#1F2937] group-hover:bg-[#1F2937] group-hover:text-white transition-all duration-300">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-black uppercase tracking-widest text-[#1F2937]">{title}</h3>
      <p className="text-xs text-[#64748B] font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
