"use client"

interface Entry {
  id: string
  entry_date: string
  content: string
  mood?: string
  is_completed: boolean
}

export default function YearProgress({ entries }: { entries: Entry[] }) {
  // Get current year dynamically
  const now = new Date()
  const currentYear = now.getFullYear()
  const startOfYear = new Date(currentYear, 0, 1)
  const endOfYear = new Date(currentYear, 11, 31)
  
  // Calculate total days in year (handles leap years automatically)
  const totalDays = Math.floor((endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1
  const loggedDays = entries.length
  const percentage = Math.round((loggedDays / totalDays) * 100)

  const daysLeft = Math.ceil((endOfYear.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  const daysElapsed = totalDays - daysLeft

  return (
    <div className="space-y-3">
      {/* Main Countdown */}
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <div className="text-center">
          <div className="text-3xl font-light tracking-tight mb-1">{daysLeft}</div>
          <div className="text-xs text-muted-foreground">days remaining in {currentYear}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Year progress</span>
          <span className="text-foreground font-medium">{percentage}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-foreground transition-all duration-500" style={{ width: `${percentage}%` }} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="rounded border border-border p-2 text-center">
          <div className="text-foreground font-light">{loggedDays}</div>
          <div className="text-muted-foreground text-xs">entries</div>
        </div>
        <div className="rounded border border-border p-2 text-center">
          <div className="text-foreground font-light">{daysElapsed}</div>
          <div className="text-muted-foreground text-xs">days passed</div>
        </div>
        <div className="rounded border border-border p-2 text-center">
          <div className="text-foreground font-light">{daysLeft}</div>
          <div className="text-muted-foreground text-xs">days left</div>
        </div>
      </div>
    </div>
  )
}
