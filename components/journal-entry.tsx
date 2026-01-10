"use client"

import type React from "react"

import { useState } from "react"

interface Entry {
  id: string
  entry_date: string
  content: string
  mood?: string
  is_completed: boolean
}

export default function JournalEntry({
  onSave,
  initialEntry,
}: {
  onSave: (content: string, mood?: string) => Promise<void>
  initialEntry: Entry | null
}) {
  const [content, setContent] = useState(initialEntry?.content || "")
  const [mood, setMood] = useState(initialEntry?.mood || "")
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setSaving(true)
    try {
      await onSave(content, mood)
      if (!initialEntry) {
        setContent("")
        setMood("")
      }
    } finally {
      setSaving(false)
    }
  }

  const formatDate = () => {
    const today = new Date()
    return today.toLocaleDateString("en-US", {
      weekday: "short",
      month: "2-digit",
      day: "2-digit",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="text-xs text-muted-foreground">{formatDate()}</div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind..."
        className="min-h-32 resize-none rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />

      <div className="flex gap-2">
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">mood (optional)</option>
          <option value="amazing">amazing</option>
          <option value="good">good</option>
          <option value="neutral">neutral</option>
          <option value="challenging">challenging</option>
          <option value="difficult">difficult</option>
        </select>

        <button
          type="submit"
          disabled={saving || !content.trim()}
          className="px-6 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {saving ? "saving..." : "save"}
        </button>
      </div>
    </form>
  )
}
