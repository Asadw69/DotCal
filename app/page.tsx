"use client"

import { useState, useEffect } from "react"
import DotGridCalendar from "@/components/dot-grid-calendar"
import EntryModal from "@/components/entry-modal"
import { ThemeToggle } from "@/components/theme-toggle"
import { loadEntries, saveEntries, addOrUpdateEntry, downloadExport } from "@/lib/storage"

interface Entry {
  id: string
  entry_date: string
  content: string
  mood?: string
  is_completed: boolean
}

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const loadedEntries = loadEntries()
    setEntries(loadedEntries)
    setLoading(false)
  }, [])

  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr)
    setIsModalOpen(true)
  }

  const handleSaveEntry = (content: string, mood?: string) => {
    try {
      const updated = addOrUpdateEntry(entries, selectedDate!, content, mood)
      saveEntries(updated)
      setEntries(updated)
      setIsModalOpen(false)
      console.log("[v0] Entry saved for:", selectedDate)
    } catch (error) {
      console.error("Error saving entry:", error)
    }
  }

  const entryMap = new Map(entries.map((e) => [e.entry_date, e]))

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex items-center justify-center min-h-screen p-2">
        <div className="w-full max-w-4xl space-y-2">
          <div className="flex justify-end">
            <ThemeToggle />
          </div>

          <DotGridCalendar entryMap={entryMap} onDayClick={handleDayClick} loading={loading} />

          <div className="rounded-3xl bg-gradient-to-b from-accent to-card border border-border/50 p-3 backdrop-blur-md flex gap-2">
            <button
              onClick={() => downloadExport()}
              className="flex-1 px-4 py-2 rounded-2xl bg-muted hover:bg-muted/80 text-foreground text-sm font-medium transition-all duration-200"
            >
              export backup
            </button>
            <button
              onClick={() =>
                alert(
                  "All entries are automatically saved to your device. They persist forever and sync across browser sessions.",
                )
              }
              className="flex-1 px-4 py-2 rounded-2xl border border-border/30 text-foreground text-sm font-medium hover:bg-muted/30 transition-all duration-200"
            >
              info
            </button>
          </div>
        </div>
      </div>

      <EntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        entry={selectedDate ? (entryMap.get(selectedDate) ?? null) : null}
        onSave={handleSaveEntry}
      />
    </main>
  )
}
