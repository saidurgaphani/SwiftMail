"use client"

import { useState, useCallback } from "react"
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
import { listItem, listContainer, staggerContainer, staggerItem, fadeInUp } from "@/animations"
import {
  Zap, Copy, RefreshCw, Trash2, Mail, ArrowLeft,
  Inbox as InboxIcon, Loader2, Plus, Clock, Paperclip,
  CheckCircle2, ShieldCheck, AlertTriangle, RotateCcw
} from "lucide-react"

// ─── SKELETON LOADER ──────────────────────────────────────────
function InboxSkeleton() {
  return (
    <div className="p-4 space-y-1">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-lg" style={{ animationDelay: `${i * 100}ms` }}>
          <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2.5 min-w-0">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-14" />
            </div>
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── EMPTY STATE ──────────────────────────────────────────────
function EmptyInbox() {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
    >
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
          <InboxIcon className="w-9 h-9 text-muted-foreground" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
          <Clock className="w-3.5 h-3.5 text-primary" />
        </div>
      </div>
      <h3 className="font-semibold text-lg mb-2">No messages yet</h3>
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
        Your inbox is waiting. Use the email address above to receive messages — they&apos;ll appear here in real-time.
      </p>
      <div className="mt-8 flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success">
        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span className="text-xs font-medium">Listening for new messages...</span>
      </div>
    </motion.div>
  )
}

// ─── ERROR STATE ──────────────────────────────────────────────
function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7 text-destructive" />
      </div>
      <h3 className="font-semibold text-lg mb-2">Something went wrong</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{error}</p>
      <Button variant="outline" onClick={onRetry} className="gap-2">
        <RotateCcw className="w-4 h-4" /> Try Again
      </Button>
    </motion.div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────
export default function DashboardPage() {
  const {
    account, messages, selectedMessage, isLoading, isRefreshing,
    error, generateEmail, refreshInbox, openMessage, deleteMessage,
    deleteAccount, clearSelectedMessage, innerLoading
  } = useTempMail()
  const { showInterstitial } = useAdMob()
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    if (!account) return
    await copyToClipboard(account.address)
    setCopied(true)
    toast.success("Copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }, [account])

  const handleDelete = useCallback(async (id: string) => {
    await deleteMessage(id)
    toast.success("Message deleted")
  }, [deleteMessage])

  const unreadCount = messages.filter(m => !m.seen).length

  // 1. Initial boot-up loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-full p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-primary/20 animate-pulse-ring" />
          </div>
          <p className="text-sm text-muted-foreground">Loading your inbox...</p>
        </motion.div>
      </div>
    )
  }

  // 2. Creating a new account
  if (innerLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-pulse-ring" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h2 className="text-xl font-semibold mb-1">Creating your inbox...</h2>
          <p className="text-muted-foreground text-sm">Setting up your secure temporary email</p>
        </motion.div>
      </div>
    )
  }

  // 3. No account yet
  if (!account) {
    return (
      <div className="flex items-center justify-center min-h-full p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="text-center max-w-md"
        >
          <div className="relative inline-flex mb-8">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl shadow-primary/25">
              <Mail className="w-11 h-11 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-card border border-border/50 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">Get Your Temporary Email</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Generate a disposable email address instantly. Your privacy is fully protected — no signup required.
          </p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white border-0 gap-2 px-10 h-13 shadow-lg shadow-primary/25 text-base"
              onClick={() => {
                showInterstitial()
                generateEmail()
              }}
            >
              <Zap className="w-5 h-5" /> Generate Email
            </Button>
          </motion.div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-sm mt-4"
            >
              {error}
            </motion.p>
          )}
        </motion.div>
      </div>
    )
  }

  // 4. Message Detail View
  if (selectedMessage) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="h-full flex flex-col"
      >
        <div className="border-b border-border/50 p-4 flex items-center gap-3 bg-card/30">
          <Button variant="ghost" size="icon" onClick={clearSelectedMessage} aria-label="Back to inbox">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold truncate">{selectedMessage.subject || "(No Subject)"}</h2>
            <p className="text-sm text-muted-foreground truncate">From: {selectedMessage.from.name || selectedMessage.from.address}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => handleDelete(selectedMessage.id)}
            aria-label="Delete message"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  {(selectedMessage.from.name || selectedMessage.from.address)[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{selectedMessage.from.name || selectedMessage.from.address}</p>
                  <p className="text-xs text-muted-foreground">{selectedMessage.from.address}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-muted-foreground">{formatDate(selectedMessage.createdAt)}</p>
                  {selectedMessage.hasAttachments && (
                    <Badge variant="secondary" className="mt-1 text-xs gap-1">
                      <Paperclip className="w-3 h-3" /> Attachments
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Separator className="mb-6" />
            {selectedMessage.html?.length > 0 ? (
              <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedMessage.html[0] }} />
            ) : (
              <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">{selectedMessage.text || "No content"}</div>
            )}
          </div>
        </ScrollArea>
      </motion.div>
    )
  }

  // 5. Main Inbox View
  return (
    <div className="h-full flex flex-col">
      {/* Topbar */}
      <div className="border-b border-border/50 p-4 space-y-3 bg-card/20">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Inbox</h1>
            {unreadCount > 0 && (
              <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 h-8"
              onClick={refreshInbox}
              disabled={isRefreshing}
              aria-label="Refresh inbox"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline text-xs">Refresh</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={deleteAccount}
              aria-label="Delete inbox"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs">Delete</span>
            </Button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="sm"
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white border-0 gap-1.5 h-8 shadow-sm shadow-primary/20"
                onClick={() => {
                  showInterstitial()
                  generateEmail()
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-xs">New</span>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Email address bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-muted/40 rounded-xl px-4 py-2.5 border border-border/50 hover:border-primary/20 transition-colors">
            <Mail className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="font-mono text-sm truncate">{account?.address}</span>
            <Badge variant="secondary" className="text-[10px] flex-shrink-0 gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Active
            </Badge>
          </div>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              className={`gap-1.5 flex-shrink-0 h-10 transition-all ${copied ? "bg-success/10 border-success/30 text-success" : ""}`}
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy email address"}
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </motion.div>
        </div>

        {/* Auto-refresh indicator */}
        {isRefreshing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-center gap-2 py-1"
          >
            <Loader2 className="w-3 h-3 animate-spin text-primary" />
            <span className="text-xs text-muted-foreground">Checking for new messages...</span>
          </motion.div>
        )}
      </div>

      {/* Messages List */}
      <ScrollArea className="flex-1">
        {isRefreshing && messages.length === 0 ? (
          <InboxSkeleton />
        ) : error && messages.length === 0 ? (
          <ErrorState error={error} onRetry={refreshInbox} />
        ) : messages.length === 0 ? (
          <EmptyInbox />
        ) : (
          <motion.div
            variants={listContainer}
            initial="initial"
            animate="animate"
          >
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  variants={listItem}
                  exit={{ opacity: 0, x: -60, transition: { duration: 0.2 } }}
                  layout
                  className="group border-b border-border/30 hover:bg-primary/[0.02] transition-all duration-200 cursor-pointer"
                  onClick={() => openMessage(msg.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Message from ${msg.from.name || msg.from.address}: ${msg.subject || "No Subject"}`}
                  onKeyDown={(e) => e.key === "Enter" && openMessage(msg.id)}
                >
                  <div className="flex items-center gap-3 sm:gap-4 px-4 py-3.5">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${msg.seen ? "bg-transparent" : "bg-primary shadow-sm shadow-primary/50"}`} />
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0 border border-primary/10">
                      {(msg.from.name || msg.from.address)[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className={`text-sm truncate ${!msg.seen ? "font-semibold text-foreground" : "font-medium text-muted-foreground"}`}>
                          {msg.from.name || msg.from.address}
                        </p>
                        <span className="text-[11px] text-muted-foreground ml-3 flex-shrink-0">{formatDate(msg.createdAt)}</span>
                      </div>
                      <p className={`text-sm truncate ${!msg.seen ? "text-foreground" : "text-muted-foreground"}`}>
                        {msg.subject || "(No Subject)"}
                      </p>
                      <p className="text-xs text-muted-foreground/70 truncate mt-0.5">{truncateText(msg.intro || "", 80)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 w-8 h-8"
                      onClick={(e) => { e.stopPropagation(); handleDelete(msg.id) }}
                      aria-label="Delete message"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </ScrollArea>
    </div>
  )
}
