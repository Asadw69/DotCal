"use client"

interface Entry {
  id: string
  entry_date: string
  content: string
  mood?: string
  is_completed: boolean
}

export default function MonthlyCalendar({
  currentMonth,
  setCurrentMonth,
  entryMap,
  onDayClick,
}: {
  currentMonth: Date
  setCurrentMonth: (date: Date) => void
  entryMap: Map<string, Entry>
  onDayClick: (date: string) => void
}) {
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  const days = []
  const current = new Date(startDate)

  while (current <= lastDay || current.getDay() !== 0) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1))
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="flex flex-col gap-6">
      {/* Month/Year Header with Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h2 className="text-lg font-light tracking-tight">
          {monthNames[month]} {year}
        </h2>

        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs text-muted-foreground font-medium py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => {
          const dateStr = day.toISOString().split("T")[0]
          const isCurrentMonth = day.getMonth() === month
          const entry = entryMap.get(dateStr)
          const isToday = day.toDateString() === new Date().toDateString()
          const isPast = day < new Date() && !isToday

          return (
            <button
              key={idx}
              onClick={() => onDayClick(dateStr)}
              disabled={day > new Date()}
              className={`
                aspect-square p-2 rounded-lg transition-all border text-sm font-light
                ${isCurrentMonth ? "" : "opacity-30 cursor-default"}
                ${entry ? "bg-foreground text-background border-foreground" : "border-border bg-card hover:bg-muted"}
                ${isToday ? "ring-1 ring-foreground ring-offset-2 ring-offset-background" : ""}
                ${day > new Date() ? "cursor-not-allowed opacity-50" : ""}
                ${!isCurrentMonth ? "cursor-default" : "cursor-pointer"}
              `}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className="text-xs">{day.getDate()}</span>
                {entry && <div className="w-1 h-1 rounded-full mt-0.5" />}
              </div>
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-muted-foreground pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-foreground" />
          <span>has entry</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm border border-border bg-card" />
          <span>no entry</span>
        </div>
      </div>
    </div>
  )
}
