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
  isInitialized: boolean
  innerLoading: boolean
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
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Restore session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("swiftmail_account")
      if (stored) {
        try {
          const acc = JSON.parse(stored) as MailTmAccount
          mailTmService.setToken(acc.token)
          setAccount(acc)
        } catch {
          localStorage.removeItem("swiftmail_account")
        }
      }
      setIsInitialized(true)
    }
  }, [])

  const generateEmail = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const domains = await mailTmService.getDomains()
      if (!domains.length) throw new Error("No domains available")

      const domain = domains[0].domain
      const username = generateRandomString(10).toLowerCase()
      const address = `${username}@${domain}`
      const password = generateRandomString(16)

      const acc = await mailTmService.createAccount(address, password)
      setAccount(acc)
      setMessages([])
      setSelectedMessage(null)

      if (typeof window !== "undefined") {
        localStorage.setItem("swiftmail_account", JSON.stringify(acc))
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
      if (err instanceof Error && err.message.includes("401")) {
        setAccount(null)
        localStorage.removeItem("swiftmail_account")
      }
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
      localStorage.removeItem("swiftmail_account")
    } catch (err) {
      console.error("Failed to delete account:", err)
      setAccount(null)
      localStorage.removeItem("swiftmail_account")
    }
  }, [account])

  const clearSelectedMessage = useCallback(() => {
    setSelectedMessage(null)
  }, [])

  // Auto-refresh every 10 seconds (less aggressive)
  useEffect(() => {
    if (account && isInitialized) {
      refreshInbox()
      const interval = setInterval(refreshInbox, 10000)
      return () => clearInterval(interval)
    }
  }, [account, refreshInbox, isInitialized])

  return {
    account,
    messages,
    selectedMessage,
    isLoading: !isInitialized,
    innerLoading: isLoading,
    isRefreshing,
    isInitialized,
    error,
    generateEmail,
    refreshInbox,
    openMessage,
    deleteMessage,
    deleteAccount,
    clearSelectedMessage,
  }
}
