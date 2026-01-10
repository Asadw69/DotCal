"use client"

interface Entry {
  id: string
  entry_date: string
  content: string
  mood?: string
  is_completed: boolean
}

export default function MemoryEntry({ entry }: { entry: Entry }) {
  return (
    <div className="rounded-lg bg-muted/50 p-4 border border-border">
      <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{entry.content}</p>
    </div>
  )
}
