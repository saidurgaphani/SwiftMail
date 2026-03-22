"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTempMail } from "@/hooks/use-temp-mail"
import { useAdMob } from "@/hooks/use-admob"
import { formatDate, copyToClipboard, truncateText } from "@/lib/utils"
import { toast } from "sonner"
import {
  Zap, Copy, RefreshCw, Trash2, Mail, ArrowLeft,
  Inbox as InboxIcon, Loader2, Plus, Clock, Paperclip,
  CheckCircle2
} from "lucide-react"

export default function DashboardPage() {
  const {
    account, messages, selectedMessage, isLoading, isRefreshing,
    error, generateEmail, refreshInbox, openMessage, deleteMessage,
    deleteAccount, clearSelectedMessage, innerLoading
  } = useTempMail()
  const { showInterstitial } = useAdMob()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!account) return
    await copyToClipboard(account.address)
    setCopied(true)
    toast.success("Copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async (id: string) => {
    await deleteMessage(id)
    toast.success("Message deleted")
  }

  // 1. Initial boot-up loading (restoring session)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-full p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
      </div>
    )
  }

  // 2. Creating a new account loading
  if (innerLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-8 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-1">Creating your inbox...</h2>
          <p className="text-muted-foreground">Setting up your secure temporary email</p>
        </div>
      </div>
    )
  }

  // 3. No account yet (Landing view of dashboard)
  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-full p-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary/25">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Get Your Temporary Email</h1>
          <p className="text-muted-foreground mb-8">Generate a disposable email address instantly. No signup required.</p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white border-0 gap-2 px-8 h-12 shadow-lg shadow-primary/25"
            onClick={() => {
              showInterstitial()
              generateEmail()
            }}
          >
            <Zap className="w-4 h-4" /> Generate Email
          </Button>
          {error && <p className="text-destructive text-sm mt-4">{error}</p>}
        </motion.div>
      </div>
    )
  }

  // 4. Detailed Message View
  if (selectedMessage) {
    return (
      <div className="h-full flex flex-col">
        <div className="border-b border-border/50 p-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={clearSelectedMessage}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold truncate">{selectedMessage.subject || "(No Subject)"}</h2>
            <p className="text-sm text-muted-foreground truncate">From: {selectedMessage.from.name || selectedMessage.from.address}</p>
          </div>
          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(selectedMessage.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                  {(selectedMessage.from.name || selectedMessage.from.address)[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{selectedMessage.from.name || selectedMessage.from.address}</p>
                  <p className="text-xs text-muted-foreground">{selectedMessage.from.address}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs text-muted-foreground">{formatDate(selectedMessage.createdAt)}</p>
                  {selectedMessage.hasAttachments && (
                    <Badge variant="secondary" className="mt-1 text-xs"><Paperclip className="w-3 h-3 mr-1" />Attachments</Badge>
                  )}
                </div>
              </div>
            </div>
            <Separator className="mb-6" />
            {selectedMessage.html?.length > 0 ? (
              <div className="prose prose-sm dark:prose-invert max-none" dangerouslySetInnerHTML={{ __html: selectedMessage.html[0] }} />
            ) : (
              <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">{selectedMessage.text || "No content"}</div>
            )}
          </div>
        </ScrollArea>
      </div>
    )
  }

  // 5. Main Inbox View
  return (
    <div className="h-full flex flex-col">
      {/* Topbar */}
      <div className="border-b border-border/50 p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold">Inbox</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1.5" onClick={refreshInbox} disabled={isRefreshing}>
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5 text-destructive hover:text-destructive" onClick={deleteAccount}>
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white border-0 gap-1.5" onClick={() => {
              showInterstitial()
              generateEmail()
            }}>
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Email</span>
            </Button>
          </div>
        </div>

        {/* Email address bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2.5 border border-border/50">
            <Mail className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="font-mono text-sm truncate">{account?.address}</span>
            <Badge variant="secondary" className="text-xs flex-shrink-0">
              <Clock className="w-3 h-3 mr-1" /> Active
            </Badge>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 flex-shrink-0" onClick={handleCopy}>
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1">
        {isRefreshing && messages.length === 0 ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b border-border/10">
                <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2 min-w-0">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <InboxIcon className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-1">No messages yet</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your inbox is empty. Use the email address above to receive messages.
            </p>

            <div className="mt-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">Checking for new mail...</span>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group border-b border-border/30 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => openMessage(msg.id)}
              >
                <div className="flex items-center gap-4 px-4 py-4">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${msg.seen ? "bg-transparent" : "bg-primary"}`} />
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                    {(msg.from.name || msg.from.address)[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className={`text-sm truncate ${!msg.seen ? "font-semibold" : "font-medium text-muted-foreground"}`}>
                        {msg.from.name || msg.from.address}
                      </p>
                      <span className="text-xs text-muted-foreground ml-3 flex-shrink-0">{formatDate(msg.createdAt)}</span>
                    </div>
                    <p className={`text-sm truncate ${!msg.seen ? "text-foreground" : "text-muted-foreground"}`}>
                      {msg.subject || "(No Subject)"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{truncateText(msg.intro || "", 80)}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(msg.id) }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </ScrollArea>
    </div>
  )
}
