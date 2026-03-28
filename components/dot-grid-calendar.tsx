"use client"

import { useState } from "react"
import { format, differenceInDays } from "date-fns"

interface DotGridCalendarProps {
  entryMap: Map<string, { id: string; content: string }>
  onDayClick: (dateStr: string) => void
  loading: boolean
}

export default function DotGridCalendar({ entryMap, onDayClick, loading }: DotGridCalendarProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)

  // Calculate year range - dynamically use current year
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const currentYear = today.getFullYear()
  const yearStart = new Date(currentYear, 0, 1)
  const yearEnd = new Date(currentYear, 11, 31)

  // Calculate days remaining
  const daysRemaining = differenceInDays(yearEnd, today)
  // Calculate total days in current year (handles leap years)
  const totalDaysInYear = differenceInDays(yearEnd, yearStart) + 1
  const daysElapsed = totalDaysInYear - daysRemaining

  // Generate all days in the year
  const allDays = []
  const currentDate = new Date(yearStart)
  while (currentDate <= yearEnd) {
    allDays.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  // Get today's memory if it exists
  const todayStr = format(today, "yyyy-MM-dd")
  const todayEntry = entryMap.get(todayStr)

  return (
    <div className="space-y-3">
      {/* Header - iOS Bubble Container */}
      <div className="rounded-3xl bg-gradient-to-b from-accent to-card border border-border/50 p-4 backdrop-blur-md">
        <div className="space-y-1 text-center">
          <div className="text-3xl font-light tracking-tight">{daysRemaining}</div>
          <p className="text-xs text-muted-foreground">days left in {currentYear}</p>
          {todayEntry && (
            <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
              <span className="inline-block w-3 h-3 rounded-full bg-primary/30"></span>
              today's memory
            </div>
          )}
        </div>
      </div>

      {/* Dot Grid - iOS Bubble Container */}
      <div className="rounded-3xl bg-gradient-to-b from-accent to-card border border-border/50 p-4 backdrop-blur-md">
        <div className="grid gap-1">
          {/* 14 columns to fit all dots on screen */}
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: "repeat(16, 1fr)",
              gridAutoRows: "auto",
            }}
          >
            {allDays.map((day, index) => {
              const dateStr = format(day, "yyyy-MM-dd")
              const hasEntry = entryMap.has(dateStr)
              const isPastOrToday = day <= today
              const isToday = day.toDateString() === today.toDateString()

              return (
                <button
                  key={index}
                  onClick={() => {
                    if (isPastOrToday) {
                      onDayClick(dateStr)
                    }
                  }}
                  onMouseEnter={() => setHoveredDate(dateStr)}
                  onMouseLeave={() => setHoveredDate(null)}
                  disabled={!isPastOrToday}
                  className={`
                    w-full aspect-square rounded-full
                    flex items-center justify-center relative
                    ${isToday ? "ring-1 ring-primary" : ""}
                    ${hasEntry
                      ? "bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:scale-110 cursor-pointer"
                      : isPastOrToday
                        ? "bg-muted hover:bg-muted/80 text-muted-foreground hover:scale-110 cursor-pointer"
                        : "bg-muted/50 text-muted-foreground/40 cursor-default opacity-50"
                    }
                  `}
                  title={`${format(day, "MMM d, yyyy")}`}
                >
                  {/* Dot visualization */}
                  <div
                    className={`w-1 h-1 rounded-full ${hasEntry ? "bg-primary-foreground scale-100" : "bg-foreground/20 scale-75"
                      }`}
                  ></div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-3 pt-3 border-t border-border/30 flex justify-between text-xs text-muted-foreground">
          <div>
            <div className="font-medium">{daysElapsed}</div>
            <div className="text-[10px]">days passed</div>
          </div>
          <div className="text-right">
            <div className="font-medium">{entryMap.size}</div>
            <div className="text-[10px]">entries</div>
          </div>
          <div className="text-right">
            <div className="font-medium">{Math.round((entryMap.size / totalDaysInYear) * 100)}%</div>
            <div className="text-[10px]">complete</div>
          </div>
        </div>
      </div>
    </div>
  )
}
