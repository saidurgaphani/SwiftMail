"use client"

import { useState, useEffect, useCallback } from "react"
import { MailTmMessageFull } from "@/types"

// We store a slightly enriched message type for history
export type HistoryMessage = {
  id: string
  address: string
  subject: string
  from: string
  fromName: string
  intro: string
  receivedAt: string
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryMessage[]>([])

  // Load history from local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("swiftmail_history")
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) {
            setHistory(parsed)
          } else {
            console.warn("Invalid history format, ignoring.")
            localStorage.removeItem("swiftmail_history")
          }
        } catch (e) {
          console.error("Failed to parse history", e)
        }
      }
    }
  }, [])

  // Add message to history
  const addToHistory = useCallback((msg: HistoryMessage) => {
    setHistory((prev) => {
      // Avoid duplicates
      if (prev.some((h) => h.id === msg.id)) return prev
      const newHistory = [msg, ...prev]
      if (typeof window !== "undefined") {
        localStorage.setItem("swiftmail_history", JSON.stringify(newHistory))
      }
      return newHistory
    })
  }, [])

  // Delete from history
  const deleteFromHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const newHistory = prev.filter((h) => h.id !== id)
      if (typeof window !== "undefined") {
        localStorage.setItem("swiftmail_history", JSON.stringify(newHistory))
      }
      return newHistory
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    if (typeof window !== "undefined") {
      localStorage.removeItem("swiftmail_history")
    }
  }, [])

  return {
    history,
    addToHistory,
    deleteFromHistory,
    clearHistory
  }
}
