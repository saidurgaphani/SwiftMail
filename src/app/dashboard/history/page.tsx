"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Clock, Search, Trash2, Mail, ArrowUpDown, X, Inbox
} from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useHistory } from "@/hooks/use-history"
import { listContainer, listItem, fadeInUp } from "@/animations"

type SortOption = "newest" | "oldest" | "subject"

export default function HistoryPage() {
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const { history, deleteFromHistory, clearHistory } = useHistory()

  const filtered = useMemo(() => {
    let items = history.filter(
      (h) =>
        (h?.subject || "").toLowerCase().includes(search.toLowerCase()) ||
        (h?.from || "").toLowerCase().includes(search.toLowerCase()) ||
        (h?.address || "").toLowerCase().includes(search.toLowerCase())
    )

    switch (sortBy) {
      case "newest":
        items = [...items].sort((a, b) => new Date(b?.receivedAt || 0).getTime() - new Date(a?.receivedAt || 0).getTime())
        break
      case "oldest":
        items = [...items].sort((a, b) => new Date(a?.receivedAt || 0).getTime() - new Date(b?.receivedAt || 0).getTime())
        break
      case "subject":
        items = [...items].sort((a, b) => (a?.subject || "").localeCompare(b?.subject || ""))
        break
    }

    return items
  }, [history, search, sortBy])

  const cycleSortOption = () => {
    const options: SortOption[] = ["newest", "oldest", "subject"]
    const currentIndex = options.indexOf(sortBy)
    setSortBy(options[(currentIndex + 1) % options.length])
  }

  const sortLabels: Record<SortOption, string> = {
    newest: "Newest First",
    oldest: "Oldest First",
    subject: "By Subject",
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-zinc-800/80 p-6 space-y-4 bg-zinc-950/20 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                History
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/20">
                  {history.length}
                </span>
              </h1>
              <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Your email archive</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 h-9 text-xs font-bold border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800 hover:text-white"
              onClick={cycleSortOption}
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">{sortLabels[sortBy]}</span>
            </Button>
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="h-9 text-xs font-bold gap-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/20"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative group/search">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within/search:text-primary transition-colors" />
          <Input
            placeholder="Search by subject, sender, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 h-12 bg-zinc-900/60 border-zinc-800 focus:border-primary/50 focus:ring-primary/20 text-white placeholder:text-zinc-600 rounded-xl transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto min-h-0 w-full relative px-4 pb-12">
        {history.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shadow-lg border border-primary/10">
                <Clock className="w-10 h-10 text-primary animate-pulse" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-card border border-border shadow-sm flex items-center justify-center">
                <Mail className="w-5 h-5 text-muted-foreground/60" />
              </div>
            </div>
            <h3 className="font-bold text-2xl mb-3 tracking-tight">No history yet</h3>
            <p className="text-muted-foreground max-w-[280px] leading-relaxed mx-auto">
              Emails received during your sessions are saved here automatically.
            </p>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-muted/30 flex items-center justify-center mb-6">
              <Search className="w-9 h-9 text-muted-foreground/40" />
            </div>
            <h3 className="font-semibold text-xl mb-2">No matches found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms</p>
            <Button
              variant="link"
              onClick={() => setSearch("")}
              className="mt-4 text-primary font-bold"
            >
              Clear filters
            </Button>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-4 py-4"
            variants={listContainer}
            initial="initial"
            animate="animate"
          >
            <AnimatePresence>
              {filtered.map((item) => {
                // ROBUST DATE HANDLING
                let formattedDate = "Recently"
                try {
                  if (item.receivedAt) {
                    formattedDate = formatDate(item.receivedAt)
                  }
                } catch (e) {
                  console.error("Date formatting failed", e)
                }

                return (
                  <motion.div
                    key={item.id}
                    variants={listItem}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    layout
                    className="group bg-zinc-900/40 border border-zinc-800/60 hover:border-primary/50 transition-all duration-300 rounded-2xl p-5 relative overflow-hidden flex flex-col gap-4 shadow-sm hover:shadow-lg backdrop-blur-sm"
                  >
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[40px] rounded-full -translate-y-12 translate-x-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    <div className="flex items-start justify-between gap-4 relative z-10">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-primary/90 to-accent flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-lg shadow-primary/30 ring-1 ring-white/10">
                          {(item.fromName || item.from || "A").charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-bold text-lg text-zinc-100 truncate max-w-[70%]">
                              {item.fromName || "Unknown Sender"}
                            </h3>
                            <div className="px-2 py-0.5 rounded-full bg-zinc-800/80 border border-zinc-700/50 text-[10px] font-bold text-zinc-400 font-mono truncate">
                              {item.from}
                            </div>
                          </div>
                          <p className="text-xs font-black text-primary tracking-wider uppercase">
                            {formattedDate}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-all text-zinc-400 hover:text-red-400 hover:bg-red-400/10 w-9 h-9 rounded-xl flex-shrink-0 bg-zinc-900/50 border border-zinc-800/50"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFromHistory(item.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2 relative z-10">
                      <h4 className="text-[17px] font-bold text-white leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {item.subject || "(No Subject)"}
                      </h4>
                      {item.intro && (
                        <p className="text-sm text-zinc-300 leading-relaxed font-medium line-clamp-2">
                          {item.intro}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-3 relative z-10">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-950/50 border border-zinc-800/80 flex-1 min-w-0">
                        <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-xs font-bold text-zinc-200 truncate">{item.address}</span>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 text-[10px] font-black uppercase tracking-widest px-2.5 h-6 shrink-0">
                        SAVED
                      </Badge>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
