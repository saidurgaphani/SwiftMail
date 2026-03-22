"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
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
        h.subject.toLowerCase().includes(search.toLowerCase()) ||
        h.from.toLowerCase().includes(search.toLowerCase()) ||
        h.address.toLowerCase().includes(search.toLowerCase())
    )

    switch (sortBy) {
      case "newest":
        items = [...items].sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())
        break
      case "oldest":
        items = [...items].sort((a, b) => new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime())
        break
      case "subject":
        items = [...items].sort((a, b) => a.subject.localeCompare(b.subject))
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
      <div className="border-b border-border/50 p-4 space-y-3 bg-card/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> History
            </h1>
            <Badge variant="secondary" className="text-xs">{history.length}</Badge>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 h-8 text-xs"
              onClick={cycleSortOption}
              aria-label={`Sort: ${sortLabels[sortBy]}`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{sortLabels[sortBy]}</span>
            </Button>
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by subject, sender, or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 bg-muted/40 border-border/50 focus:border-primary/30"
            aria-label="Search email history"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        {filtered.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="flex flex-col items-center justify-center py-24 text-center px-4"
          >
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                {search ? (
                  <Search className="w-8 h-8 text-muted-foreground" />
                ) : (
                  <Inbox className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">
              {search ? "No results found" : "No history yet"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {search
                ? `No emails match "${search}". Try a different search term.`
                : "Your received emails will be saved here automatically for easy reference."
              }
            </p>
            {search && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 gap-1.5"
                onClick={() => setSearch("")}
              >
                <X className="w-3.5 h-3.5" /> Clear Search
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={listContainer}
            initial="initial"
            animate="animate"
          >
            <AnimatePresence>
              {filtered.map((item) => (
                <motion.div
                  key={item.id}
                  variants={listItem}
                  exit={{ opacity: 0, x: -60, transition: { duration: 0.2 } }}
                  layout
                  className="group border-b border-border/30 hover:bg-primary/[0.02] transition-all duration-200 px-4 py-3.5"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0 mt-0.5 border border-primary/10">
                      {item.from[0]?.toUpperCase() || "M"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-sm font-medium truncate">{item.subject || "(No Subject)"}</p>
                        <span className="text-[11px] text-muted-foreground ml-3 flex-shrink-0">{formatDate(item.receivedAt)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">From: {item.from}</p>
                      {item.intro && (
                        <p className="text-xs text-foreground/60 mt-1.5 line-clamp-2 leading-relaxed">
                          {item.intro}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-[10px] font-mono h-5 px-1.5">{item.address}</Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 w-8 h-8"
                      onClick={() => deleteFromHistory(item.id)}
                      aria-label="Delete from history"
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
