"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import mailTmService from "@/services/mail-tm"
import type { MailTmAccount, MailTmMessage, MailTmMessageFull } from "@/types"
import { generateRandomString } from "@/lib/utils"

interface UseTempMailReturn {
  account: MailTmAccount | null
  messages: MailTmMessage[]
  selectedMessage: MailTmMessageFull | null
  isLoading: boolean
  isRefreshing: boolean
  error: string | null
  generateEmail: () => Promise<void>
  refreshInbox: () => Promise<void>
  openMessage: (id: string) => Promise<void>
  deleteMessage: (id: string) => Promise<void>
  deleteAccount: () => Promise<void>
  clearSelectedMessage: () => void
}

export function useTempMail(): UseTempMailReturn {
  const [account, setAccount] = useState<MailTmAccount | null>(null)
  const [messages, setMessages] = useState<MailTmMessage[]>([])
  const [selectedMessage, setSelectedMessage] = useState<MailTmMessageFull | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const generateEmail = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const domains = await mailTmService.getDomains()
      if (!domains.length) throw new Error("No domains available")

      const domain = domains[0].domain
      const username = generateRandomString(10)
      const address = `${username}@${domain}`
      const password = generateRandomString(16)

      const acc = await mailTmService.createAccount(address, password)
      setAccount(acc)
      setMessages([])
      setSelectedMessage(null)

      // Store in session for persistence
      if (typeof window !== "undefined") {
        sessionStorage.setItem("swiftmail_account", JSON.stringify(acc))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate email")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshInbox = useCallback(async () => {
    if (!account) return
    setIsRefreshing(true)
    try {
      const msgs = await mailTmService.getMessages(account.token)
      setMessages(msgs)
    } catch (err) {
      console.error("Failed to refresh:", err)
    } finally {
      setIsRefreshing(false)
    }
  }, [account])

  const openMessage = useCallback(
    async (id: string) => {
      if (!account) return
      try {
        const msg = await mailTmService.getMessage(id, account.token)
        setSelectedMessage(msg)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to open message")
      }
    },
    [account]
  )

  const deleteMessage = useCallback(
    async (id: string) => {
      if (!account) return
      try {
        await mailTmService.deleteMessage(id, account.token)
        setMessages((prev) => prev.filter((m) => m.id !== id))
        if (selectedMessage?.id === id) setSelectedMessage(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete message")
      }
    },
    [account, selectedMessage]
  )

  const deleteAccount = useCallback(async () => {
    if (!account) return
    try {
      await mailTmService.deleteAccount(account.id, account.token)
      setAccount(null)
      setMessages([])
      setSelectedMessage(null)
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("swiftmail_account")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete account")
    }
  }, [account])

  const clearSelectedMessage = useCallback(() => {
    setSelectedMessage(null)
  }, [])

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (account) {
      refreshInbox()
      intervalRef.current = setInterval(refreshInbox, 5000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [account, refreshInbox])

  // Restore session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("swiftmail_account")
      if (stored) {
        try {
          const acc = JSON.parse(stored) as MailTmAccount
          mailTmService.setToken(acc.token)
          setAccount(acc)
        } catch {
          sessionStorage.removeItem("swiftmail_account")
        }
      }
    }
  }, [])

  return {
    account,
    messages,
    selectedMessage,
    isLoading,
    isRefreshing,
    error,
    generateEmail,
    refreshInbox,
    openMessage,
    deleteMessage,
    deleteAccount,
    clearSelectedMessage,
  }
}
