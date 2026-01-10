export interface StoredEntry {
  id: string
  entry_date: string
  content: string
  mood?: string
  is_completed: boolean
}

const STORAGE_KEY = "journal_entries"

export function loadEntries(): StoredEntry[] {
  try {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error loading entries from localStorage:", error)
    return []
  }
}

export function saveEntries(entries: StoredEntry[]): void {
  try {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    console.log("[v0] Saved to localStorage:", entries.length, "entries")
  } catch (error) {
    console.error("Error saving entries to localStorage:", error)
  }
}

export function addOrUpdateEntry(
  entries: StoredEntry[],
  entry_date: string,
  content: string,
  mood?: string,
): StoredEntry[] {
  const updated = [...entries]
  const existingIndex = updated.findIndex((e) => e.entry_date === entry_date)

  if (existingIndex >= 0) {
    updated[existingIndex] = {
      ...updated[existingIndex],
      content,
      mood,
      is_completed: true,
    }
  } else {
    updated.push({
      id: `${entry_date}-${Date.now()}`,
      entry_date,
      content,
      mood,
      is_completed: true,
    })
  }

  return updated
}

export function exportAsJSON(): string {
  const entries = loadEntries()
  return JSON.stringify(
    {
      exported_at: new Date().toISOString(),
      total_entries: entries.length,
      entries: entries,
    },
    null,
    2,
  )
}

export function downloadExport(): void {
  const data = exportAsJSON()
  const blob = new Blob([data], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `journal-backup-${new Date().toISOString().split("T")[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
