"use client"

interface Entry {
  id: string
  entry_date: string
  is_completed: boolean
}

export default function CountdownCalendar({ entries }: { entries: Entry[] }) {
  // Get current year dynamically
  const now = new Date()
  const currentYear = now.getFullYear()
  const startOfYear = new Date(currentYear, 0, 1)
  const endOfYear = new Date(currentYear, 11, 31)
  const totalDays = Math.floor((endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1

  const completedDates = new Set(entries.filter((e) => e.is_completed).map((e) => e.entry_date))

  const days = Array.from({ length: totalDays }, (_, i) => {
    const date = new Date(startOfYear)
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split("T")[0]
    return {
      date: dateStr,
      isCompleted: completedDates.has(dateStr),
      isPast: date <= new Date(),
    }
  })

  const cols = 20
  const rows = Math.ceil(days.length / cols)

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Grid of dots */}
      <div
        className="flex flex-wrap justify-center gap-2"
        style={{
          maxWidth: `${cols * 12}px`,
        }}
      >
        {days.map((day, idx) => (
          <div
            key={idx}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              day.isCompleted ? "bg-foreground" : day.isPast ? "bg-muted" : "bg-muted/30"
            }`}
            title={day.date}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="text-xs text-muted-foreground">{completedDates.size} days logged</div>
    </div>
  )
}
