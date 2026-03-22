"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, 
  Search, 
  Trash2, 
  Mail, 
  ArrowUpDown, 
  X, 
  ChevronRight,
  History as HistoryIcon,
  Inbox,
  Settings,
  User,
  Bell
} from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useHistory } from "@/hooks/use-history"
import { staggerContainer, staggerItem } from "@/animations"

type SortOption = "newest" | "oldest" | "subject"

export default function HistoryPage() {
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const { history, deleteFromHistory, clearHistory } = useHistory()

  // Filter and Sort Logic
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

  const sortLabels: Record<SortOption, string> = {
    newest: "Newest First",
    oldest: "Oldest First",
    subject: "By Subject",
  }

  const cycleSort = () => {
    const options: SortOption[] = ["newest", "oldest", "subject"]
    const nextIndex = (options.indexOf(sortBy) + 1) % options.length
    setSortBy(options[nextIndex])
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto h-full overflow-auto pb-48">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Header Section */}
        <motion.div variants={staggerItem} className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-primary" /> History
            <Badge variant="secondary" className="ml-2 px-2 py-0.5 text-[10px] font-mono">
              {history.length}
            </Badge>
          </h1>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={cycleSort}
              className="h-9 border-border/50 bg-muted/30 text-muted-foreground hover:bg-muted/50 font-medium gap-2 text-xs"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortLabels[sortBy]}</span>
            </Button>
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearHistory}
                className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                title="Clear All"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div variants={staggerItem} className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <Input
            placeholder="Search saved emails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-11 bg-muted/20 border-border/50 focus:border-primary/30 text-sm placeholder:text-muted-foreground/40 rounded-xl transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>


        {/* Main Content Area */}
        <motion.div variants={staggerItem} className="space-y-3">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center border border-border/50">
                <Inbox className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-muted-foreground">Your archive is empty</h3>
                <p className="text-xs text-muted-foreground/60">Emails you receive will appear here automatically.</p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <Search className="w-10 h-10 text-muted-foreground/20 mb-4" />
               <h3 className="text-base font-semibold text-muted-foreground">No results for "{search}"</h3>
               <Button variant="link" onClick={() => setSearch("")} className="text-primary text-xs">Clear search</Button>
            </div>
          ) : (
            <div className="grid gap-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((item) => (
                  <HistoryCard 
                    key={item.id} 
                    item={item} 
                    onDelete={() => deleteFromHistory(item.id)} 
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

function HistoryCard({ item, onDelete }: { item: any, onDelete: () => void }) {
  // ROBUST DATE FORMATTING
  const displayDate = useMemo(() => {
    try {
      if (!item.receivedAt) return "Recently"
      return formatDate(item.receivedAt)
    } catch (e) {
      return "Recently"
    }
  }, [item.receivedAt])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      layout
      className="bg-card/30 border border-border/50 p-4 rounded-xl flex flex-col gap-3 group transition-all hover:bg-muted/30 active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/10 shrink-0">
            <Mail className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-sm font-semibold text-foreground truncate max-w-[150px]">
                {item.fromName || "Unknown Sender"}
              </h3>
              <Badge variant="ghost" className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0 h-4 border-none font-mono">
                {item.from}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-primary/80">{displayDate}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/20" />
              <span className="text-[11px] text-muted-foreground truncate">{item.address}</span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="h-8 w-8 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/5 rounded-lg"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="px-1">
        <h4 className="text-sm font-semibold text-foreground leading-tight mb-1 group-hover:text-primary transition-colors">
          {item.subject || "(No Subject)"}
        </h4>
        {item.intro && (
          <p className="text-[13px] text-muted-foreground line-clamp-1 leading-relaxed">
            {item.intro}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/20 mt-1">
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest">
          <Clock className="w-3 h-3" />
          Archived
        </div>
        <div className="px-2 py-0.5 bg-success/5 border border-success/10 rounded-full text-[9px] font-bold text-success/70 uppercase tracking-wider">
          Verified
        </div>
      </div>
    </motion.div>

  )
}
