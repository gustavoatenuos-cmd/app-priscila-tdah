"use client"

import * as React from "react"
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircleIcon,
  SearchIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
]

interface Event {
  id: number
  name: string
  time: string
  datetime: string
}

interface CalendarData {
  day: Date
  events: Event[]
}

interface FullScreenCalendarProps {
  data: CalendarData[]
}

export function FullScreenCalendar({ data }: FullScreenCalendarProps) {
  const today = startOfToday()
  const [selectedDay, setSelectedDay] = React.useState(today)
  const [currentMonth, setCurrentMonth] = React.useState(
    format(today, "MMM-yyyy"),
  )
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date())

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  })

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  function goToToday() {
    setCurrentMonth(format(today, "MMM-yyyy"))
  }

  return (
    <div className="flex flex-1 flex-col bg-white rounded-[32px] border border-[#E5E7EB] overflow-hidden shadow-sm">
      {/* Calendar Header */}
      <div className="flex flex-col space-y-4 p-6 md:flex-row md:items-center md:justify-between md:space-y-0 lg:flex-none bg-[#F9FAFB] border-b">
        <div className="flex flex-auto">
          <div className="flex items-center gap-4">
            <div className="hidden w-20 flex-col items-center justify-center rounded-2xl border bg-white p-2 md:flex shadow-sm">
              <h1 className="text-[10px] font-black uppercase text-[#84A59D] tracking-widest">
                {format(today, "MMM")}
              </h1>
              <div className="text-xl font-black text-[#1F2937]">
                <span>{format(today, "d")}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-black text-[#1F2937] uppercase tracking-tight">
                {format(firstDayCurrentMonth, "MMMM, yyyy")}
              </h2>
              <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">
                {format(firstDayCurrentMonth, "MMM d")} — {format(endOfMonth(firstDayCurrentMonth), "MMM d")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-4">
          <div className="inline-flex w-full -space-x-px rounded-xl shadow-sm md:w-auto overflow-hidden border">
            <Button
              onClick={previousMonth}
              className="rounded-none shadow-none h-10 w-10 p-0"
              variant="ghost"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              onClick={goToToday}
              className="px-6 rounded-none shadow-none h-10 font-bold text-xs uppercase tracking-widest"
              variant="ghost"
            >
              Hoje
            </Button>
            <Button
              onClick={nextMonth}
              className="rounded-none shadow-none h-10 w-10 p-0"
              variant="ghost"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="hidden h-6 md:block" />

          <Button className="w-full gap-2 md:w-auto bg-[#1F2937] text-white rounded-xl font-black uppercase tracking-widest text-[10px] h-10 px-6">
            <PlusCircleIcon className="h-4 w-4" />
            <span>Novo Registro</span>
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 flex flex-col">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 border-b text-center text-[10px] font-black uppercase tracking-[0.2em] text-[#9CA3AF] bg-white">
          <div className="py-4 border-r">Dom</div>
          <div className="py-4 border-r">Seg</div>
          <div className="py-4 border-r">Ter</div>
          <div className="py-4 border-r">Qua</div>
          <div className="py-4 border-r">Qui</div>
          <div className="py-4 border-r">Sex</div>
          <div className="py-4">Sáb</div>
        </div>

        {/* Calendar Days */}
        <div className="flex-1 grid grid-cols-7 auto-rows-fr">
          {days.map((day, dayIdx) => (
            <div
              key={dayIdx}
              onClick={() => setSelectedDay(day)}
              className={cn(
                "relative flex flex-col min-h-[120px] border-b border-r p-3 transition-colors hover:bg-[#F9FAFB] cursor-pointer",
                !isSameMonth(day, firstDayCurrentMonth) && "bg-[#F3F4F6]/50 text-[#9CA3AF]",
                isEqual(day, selectedDay) && "bg-[#84A59D]/5 ring-1 ring-inset ring-[#84A59D]/20 z-10"
              )}
            >
              <header className="flex justify-between items-start">
                <time
                  dateTime={format(day, "yyyy-MM-dd")}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black",
                    isToday(day) && "bg-[#1F2937] text-white",
                    !isToday(day) && isSameMonth(day, firstDayCurrentMonth) && "text-[#1F2937]",
                    !isSameMonth(day, firstDayCurrentMonth) && "text-[#9CA3AF]"
                  )}
                >
                  {format(day, "d")}
                </time>
              </header>
              
              <div className="mt-2 space-y-1">
                {data
                  .filter((item) => isSameDay(item.day, day))
                  .map((item) => (
                    <div key={day.toString()} className="space-y-1">
                      {item.events.map((event) => (
                        <div
                          key={event.id}
                          className="px-2 py-1.5 rounded-lg bg-white border border-[#E5E7EB] shadow-sm text-[10px] font-bold text-[#1F2937] truncate flex flex-col"
                        >
                          <span className="truncate">{event.name}</span>
                          <span className="text-[8px] text-[#84A59D] uppercase tracking-wider">{event.time}</span>
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
