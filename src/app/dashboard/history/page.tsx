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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 sm:p-6 max-w-2xl mx-auto w-full flex-1 overflow-y-auto pb-48">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-6"
        >
          {/* Header Section */}
          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <HistoryIcon className="w-5 h-5 text-primary shrink-0" /> <span className="truncate">History</span>
              <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-mono shrink-0">
                {history.length}
              </Badge>
            </h1>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <Button
                variant="outline"
                size="sm"
                onClick={cycleSort}
                className="h-8 border-border/50 bg-muted/30 text-muted-foreground hover:bg-muted/50 font-medium gap-1.5 text-[11px] shrink-0"
              >
                <ArrowUpDown className="w-3 h-3" />
                <span>{sortLabels[sortBy]}</span>
              </Button>
              {history.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearHistory}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 shrink-0"
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
                <div className="w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center border border-border/50 shadow-sm">
                  <Inbox className="w-7 h-7 text-muted-foreground/30" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-muted-foreground">Your archive is empty</h3>
                  <p className="text-xs text-muted-foreground/60 px-6">Emails you receive will appear here automatically.</p>
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                 <Search className="w-10 h-10 text-muted-foreground/20 mb-3" />
                 <h3 className="text-base font-semibold text-muted-foreground">No results found</h3>
                 <p className="text-xs text-muted-foreground/60 mb-4 px-6 truncate max-w-full">No matches for "{search}"</p>
                 <Button variant="link" onClick={() => setSearch("")} className="text-primary text-xs h-auto p-0 font-bold">Clear search</Button>
              </div>
            ) : (
              <div className="grid gap-2.5">
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
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      className="bg-card/20 border border-border/50 p-3 sm:p-4 rounded-xl flex flex-col gap-2.5 group transition-all hover:bg-muted/10 active:scale-[0.99] w-full min-w-0"
    >
      <div className="flex items-center gap-3 w-full">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/10 shrink-0">
          <Mail className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <h3 className="text-sm font-semibold text-foreground truncate">
              {item.fromName || "Unknown Sender"}
            </h3>
            <span className="text-[10px] text-muted-foreground/60 font-medium shrink-0">
              {displayDate}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground/60 truncate font-medium">
            Subject: {item.subject || "(No Subject)"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="h-8 w-8 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 rounded-lg shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      <div className="px-0.5 border-t border-border/10 pt-2.5 flex items-center justify-between gap-3">
         <div className="flex-1 min-w-0">
           <p className="text-[12px] text-muted-foreground/80 line-clamp-1 italic font-medium">
             {item.intro || "No preview available..."}
           </p>
         </div>
         <Badge variant="outline" className="text-[9px] font-bold text-success/60 bg-success/5 border-success/10 px-1.5 py-0 shrink-0 h-4">
           SECURE
         </Badge>
      </div>
    </motion.div>


  )
}
