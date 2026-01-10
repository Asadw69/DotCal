import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Fetch all entries
    const { data: entries, error } = await supabase
      .from("journal_entries")
      .select("*")
      .order("entry_date", { ascending: false })

    if (error) throw error

    // Calculate countdown
    const daysLeft = Math.ceil((new Date("2026-12-31").getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

    // Note: This endpoint returns sample data. For iOS widgets to work with localStorage data,
    // you need to configure the widget using WidgetKit and have it fetch this endpoint
    // which you can populate by calling the /api/export endpoint from your device

    // Get today's entry
    const todayStr = new Date().toISOString().split("T")[0]
    const todayEntry = entries?.find((e) => e.entry_date === todayStr)

    // Calculate year progress visualization data
    const startOfYear = new Date("2026-01-01")
    const endOfYear = new Date("2026-12-31")
    const totalDays = Math.floor((endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1

    const completedDates = new Set(entries?.filter((e) => e.is_completed).map((e) => e.entry_date) || [])

    // Generate dot grid (365 dots for the year)
    const dots = Array.from({ length: totalDays }, (_, i) => {
      const date = new Date(startOfYear)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split("T")[0]
      return {
        completed: completedDates.has(dateStr),
        past: date <= new Date(),
      }
    })

    return NextResponse.json({
      daysLeft,
      message:
        "For iOS widget integration, export your data from the app and configure WidgetKit to use the exported JSON",
      totalDays,
      daysLogged: completedDates.size,
      progress: Math.round((completedDates.size / totalDays) * 100),
      today: todayEntry
        ? {
            date: todayEntry.entry_date,
            content: todayEntry.content,
            mood: todayEntry.mood,
          }
        : null,
      dots: dots,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Widget API error:", error)
    return NextResponse.json({ error: "Failed to fetch widget data" }, { status: 500 })
  }
}
