"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface Entry {
  id: string
  entry_date: string
  content: string
  mood?: string
  is_completed: boolean
}

export default function EntryModal({
  isOpen,
  onClose,
  selectedDate,
  entry,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  selectedDate: string | null
  entry: Entry | null
  onSave: (content: string, mood?: string) => void
}) {
  const [content, setContent] = useState("")
  const [mood, setMood] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (entry) {
      setContent(entry.content)
      setMood(entry.mood || "")
    } else {
      setContent("")
      setMood("")
    }
  }, [entry, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !selectedDate) return

    setSaving(true)
    try {
      onSave(content, mood)
    } finally {
      setSaving(false)
    }
  }

  const formatDate = () => {
    if (!selectedDate) return ""
    const date = new Date(selectedDate)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    })
  }

  const getPlaceholder = () => {
    if (!selectedDate) return "What was on your mind?"
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selected = new Date(selectedDate)
    selected.setHours(0, 0, 0, 0)
    
    if (selected.getTime() === today.getTime()) {
      return "What was on your mind today?"
    } else {
      return "What you forgot to add?"
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-accent to-card border border-border/50 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4 sm:slide-in-from-center duration-300">
        {/* Header */}
        <div className="sticky top-0 border-b border-border/30 bg-gradient-to-b from-accent to-card/80 backdrop-blur p-6 flex items-center justify-between">
          <div>
            <h2 className="font-light text-lg tracking-tight">{formatDate()}</h2>
            <p className="text-xs text-muted-foreground">{selectedDate}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted/50 rounded-full transition-colors duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Content Textarea */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full min-h-48 p-4 rounded-2xl border border-border/30 bg-card/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none transition-all duration-200"
          />

          {/* Mood Selector */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground block">how are you feeling?</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full p-3 rounded-2xl border border-border/30 bg-card/50 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all duration-200"
            >
              <option value="">optional</option>
              <option value="amazing">amazing</option>
              <option value="good">good</option>
              <option value="neutral">neutral</option>
              <option value="challenging">challenging</option>
              <option value="difficult">difficult</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-2xl border border-border/30 text-foreground hover:bg-muted/30 transition-all duration-200 font-medium text-sm"
            >
              cancel
            </button>
            <button
              type="submit"
              disabled={saving || !content.trim()}
              className="flex-1 px-4 py-3 rounded-2xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {saving ? "saving..." : "save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
