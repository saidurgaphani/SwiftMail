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
            <AnimatePresence mode="popLayout">
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
                    className="group glass-card border border-border/40 hover:border-primary/30 transition-all duration-300 rounded-2xl p-5 relative overflow-hidden flex flex-col gap-4 shadow-sm hover:shadow-md"
                  >
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] rounded-full -translate-y-12 translate-x-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
 
                    <div className="flex items-start justify-between gap-4 relative z-10">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-lg shadow-primary/20">
                          {(item.fromName || item.from || "A").charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-bold text-[16px] text-foreground truncate max-w-[70%]">
                              {item.fromName || "Unknown Sender"}
                            </h3>
                            <Badge variant="secondary" className="text-[10px] font-mono font-medium px-2 py-0 h-4 bg-muted/60 text-muted-foreground tracking-tighter truncate">
                              {item.from}
                            </Badge>
                          </div>
                          <p className="text-xs font-bold text-primary tracking-wide uppercase">
                            {formattedDate}
                          </p>
                        </div>
                      </div>
 
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:text-destructive hover:bg-destructive/10 w-9 h-9 rounded-xl flex-shrink-0 bg-background/50 border border-border/40"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFromHistory(item.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
 
                    <div className="space-y-2 relative z-10">
                      <h4 className="text-[15px] font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {item.subject || "(No Subject)"}
                      </h4>
                      {item.intro && (
                        <p className="text-sm text-foreground/70 line-clamp-2 leading-relaxed font-medium">
                          {item.intro}
                        </p>
                      )}
                    </div>
 
                    <div className="pt-2 flex items-center justify-between gap-3 relative z-10">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/40 border border-border/50 flex-1 min-w-0">
                        <Mail className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[11px] font-medium text-muted-foreground truncate">{item.address}</span>
                      </div>
                      <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/10 text-[10px] font-bold uppercase tracking-widest px-2 pr-2.5 h-6">
                        Saved
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
