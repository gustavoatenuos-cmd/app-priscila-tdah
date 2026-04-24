"use client"

import { ComponentPropsWithoutRef, useEffect, useRef, useState } from "react"
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion"
import {
  Zap,
  Target,
  Brain,
} from "lucide-react";

const tabs = [
  {
    icon: Target,
    title: "Fluxo de Foco",
    description: "Elimine o ruído mental e entre no estado de flow com ferramentas projetadas para o cérebro neurodivergente.",
    isNew: false,
    backgroundPositionX: 0,
    backgroundPositionY: 0,
    backgroundSizeX: 150,
  },
  {
    icon: Zap,
    title: "Planejamento Ágil",
    description: "Transforme o caos em clareza. Priorize o essencial sem a sobrecarga das listas tradicionais.",
    isNew: true,
    backgroundPositionX: 80,
    backgroundPositionY: 90,
    backgroundSizeX: 135,
  },
  {
    icon: Brain,
    title: "Suporte Cognitivo IA",
    description: "Uma IA que entende o TDAH. Guia personalizado para te tirar da paralisia e retomar o ritmo.",
    isNew: false,
    backgroundPositionX: 120,
    backgroundPositionY: 30,
    backgroundSizeX: 170,
  },
];


const FeatureTab = (
  props: (typeof tabs)[number] &
    ComponentPropsWithoutRef<"div"> & { selected: boolean }
) => {
  const tabRef = useRef<HTMLDivElement>(null)

  const xPercent = useMotionValue(100)
  const yPercent = useMotionValue(0)
  const maskImage = useMotionTemplate`radial-gradient(100px 50px at ${xPercent}% ${yPercent}%, black, transparent)`

  useEffect(() => {
    if (!tabRef.current || !props.selected) return

    xPercent.set(0)
    yPercent.set(0)
    const { height, width } = tabRef.current?.getBoundingClientRect()
    const circumference = height * 2 + width * 2
    const times = [
      0,
      width / circumference,
      (width + height) / circumference,
      (width * 2 + height) / circumference,
      1,
    ]
    
    animate(xPercent, [0, 100, 100, 0, 0], {
      duration: 4,
      times,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop",
    })
    animate(yPercent, [0, 0, 100, 100, 0], {
      times,
      duration: 4,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop",
    })
  }, [props.selected, xPercent, yPercent])

  return (
    <div
      ref={tabRef}
      className="border border-[#E5E7EB] dark:border-gray-800 rounded-2xl flex items-center gap-3 pr-6 py-3 relative cursor-pointer hover:bg-white/50 transition-colors shadow-sm group"
      onClick={props.onClick}
    >
      {props.selected && (
        <motion.div
          style={{
            maskImage,
          }}
          className="absolute inset-0 -m-px border-2 border-[#84A59D] rounded-2xl z-10"
        ></motion.div>
      )}

      <div className="h-10 w-10 rounded-xl ml-4 inline-flex items-center justify-center bg-[#84A59D]/10 text-[#84A59D] group-hover:scale-110 transition-transform">
        <props.icon className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        <div className="text-sm font-black uppercase tracking-widest text-[#1F2937]">{props.title}</div>
      </div>
      {props.isNew && (
        <div className="bg-[#84A59D] rounded-full text-white px-2 py-0.5 font-black text-[8px] uppercase tracking-tighter ml-2">
          Novo
        </div>
      )}
    </div>
  )
}

export default function RuixenFeaturedImageSection() {
  const [selectedTab, setSelectedTab] = useState(0)

  const backgroundPositionX = useMotionValue(tabs[0].backgroundPositionX)
  const backgroundPositionY = useMotionValue(tabs[0].backgroundPositionY)
  const backgroundSizeX = useMotionValue(tabs[0].backgroundSizeX)

  const backgroundPosition = useMotionTemplate`${backgroundPositionX}% ${backgroundPositionY}%`
  const backgroundSize = useMotionTemplate`${backgroundSizeX}% auto`

  const handleSelecttab = (index: number) => {
    setSelectedTab(index)

    animate(
      backgroundSizeX,
      [backgroundSizeX.get(), 100, tabs[index].backgroundSizeX],
      {
        duration: 2,
        ease: "easeInOut",
      }
    )
    animate(
      backgroundPositionX,
      [backgroundPositionX.get(), 100, tabs[index].backgroundPositionX],
      {
        duration: 2,
        ease: "easeInOut",
      }
    )
    animate(
      backgroundPositionY,
      [backgroundPositionY.get(), 100, tabs[index].backgroundPositionY],
      {
        duration: 2,
        ease: "easeInOut",
      }
    )
  }

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#84A59D]/5 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black uppercase tracking-widest bg-[#84A59D]/10 text-[#84A59D] rounded-full border border-[#84A59D]/20">
            Experiência do Usuário
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-[#1F2937] tracking-tighter uppercase leading-[0.9]">
            Desenhado para <br />
            <span className="text-[#84A59D]">sua mente inquietante.</span>
          </h2>
          <p className="text-[#64748B] text-lg md:text-xl font-medium mt-8 max-w-2xl mx-auto leading-relaxed">
            Eliminamos a fricção e o ruído para que você possa focar no que realmente importa. 
            Uma interface que respira junto com você.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex flex-col gap-4 w-full lg:w-1/3">
            {tabs.map((tab, tabIndex) => (
              <FeatureTab
                {...tab}
                selected={selectedTab === tabIndex}
                onClick={() => handleSelecttab(tabIndex)}
                key={tab.title}
              />
            ))}
          </div>

          <div className="flex-1 w-full lg:w-2/3">
             <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#84A59D]/20 to-transparent blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="border-4 border-[#1F2937] rounded-[48px] p-3 bg-white shadow-2xl relative z-10">
                  <motion.div
                    className="aspect-video bg-cover bg-no-repeat rounded-[32px] border border-[#E5E7EB]"
                    style={{
                      backgroundPosition,
                      backgroundSize,
                      backgroundImage: `url(https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&q=80&w=2070)`,
                    }}
                  >
                    {/* Overlay content to make it look like an app */}
                    <div className="absolute inset-0 bg-black/5 rounded-[32px]" />
                  </motion.div>
                </div>
                
                {/* Floating caption */}
                <motion.div 
                  key={selectedTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute -bottom-6 -right-6 md:right-12 bg-[#1F2937] text-white p-8 rounded-[32px] shadow-2xl max-w-xs z-20 border-t-4 border-[#84A59D]"
                >
                  <p className="text-xs font-black uppercase tracking-widest text-[#84A59D] mb-2">Destaque</p>
                  <p className="text-sm font-medium leading-relaxed opacity-80">
                    {tabs[selectedTab].description}
                  </p>
                </motion.div>
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}
