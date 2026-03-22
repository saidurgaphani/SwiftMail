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
      <div className="flex-1 overflow-y-auto min-h-0 w-full relative">
        {history.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="flex flex-col items-center justify-center py-24 text-center px-4"
          >
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center shadow-inner">
                <Inbox className="w-9 h-9 text-primary/40" />
              </div>
            </div>
            <h3 className="font-bold text-xl mb-2 text-foreground">No history yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Your received emails will be saved here automatically for easy reference.
            </p>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="flex flex-col items-center justify-center py-24 text-center px-4"
          >
            <div className="w-20 h-20 rounded-3xl bg-muted/30 flex items-center justify-center mb-6">
              <Search className="w-9 h-9 text-muted-foreground/50" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No results found</h3>
            <p className="text-sm text-muted-foreground">No emails match &quot;{search}&quot;</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-6 h-9 gap-2 rounded-xl"
              onClick={() => setSearch("")}
            >
              <X className="w-3.5 h-3.5" /> Clear search
            </Button>
          </motion.div>
        ) : (
          <motion.div
            className="divide-y divide-border/20"
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
                  className="group relative hover:bg-primary/[0.03] transition-colors duration-200 px-5 py-5 cursor-default"
                >
                  <div className="flex items-start gap-4 sm:gap-5 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0 mt-0.5 border border-primary/20 shadow-sm transition-transform group-hover:scale-105">
                      {(item.fromName || item.from || "A").charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <h3 className="text-[15px] font-bold text-foreground truncate group-hover:text-primary transition-colors flex-1">
                          {item.subject || "(No Subject)"}
                        </h3>
                        <span className="text-[10px] font-bold text-primary/70 uppercase tracking-wider whitespace-nowrap bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                          {formatDate(item.receivedAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        <p className="text-xs text-foreground/90 font-semibold truncate">
                          {item.fromName ? `${item.fromName} <${item.from}>` : item.from}
                        </p>
                      </div>
                      
                      {item.intro && (
                        <p className="text-sm text-foreground/70 line-clamp-2 leading-relaxed mb-3 pr-8">
                          {item.intro}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] font-mono h-5 px-2 bg-muted/30 border-border/50 text-muted-foreground font-medium">
                          {item.address}
                        </Badge>
                      </div>
                    </div>
 
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0 -mr-2 opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:text-destructive hover:bg-destructive/10 w-9 h-9 rounded-xl shadow-sm bg-background/50 border border-border/50"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFromHistory(item.id);
                      }}
                      aria-label="Delete from history"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
