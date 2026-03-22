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
  Inbox
} from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useHistory } from "@/hooks/use-history"

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
    <div className="min-h-full bg-zinc-950 flex flex-col pt-safe px-4 pb-48">
      {/* Header Section */}
      <div className="py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <HistoryIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">History</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  Total Saved
                </span>
                <span className="text-sm font-bold text-primary">{history.length} Emails</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={cycleSort}
              className="h-10 bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white font-bold gap-2"
            >
              <ArrowUpDown className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">{sortLabels[sortBy]}</span>
            </Button>
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearHistory}
                className="h-10 w-10 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl"
                title="Clear All"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
          <Input
            placeholder="Search your archive..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-14 bg-zinc-900/80 border-zinc-800 focus:border-primary/50 text-white text-lg placeholder:text-zinc-600 rounded-2xl transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-4">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
              <Inbox className="w-8 h-8 text-zinc-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-400">Your archive is empty</h3>
              <p className="text-sm text-zinc-600">Emails you receive will appear here automatically.</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <Search className="w-10 h-10 text-zinc-800 mb-4" />
             <h3 className="text-lg font-bold text-zinc-500">No results for "{search}"</h3>
             <Button variant="link" onClick={() => setSearch("")} className="text-primary font-bold">Clear search</Button>
          </div>
        ) : (
          <div className="grid gap-4">
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col gap-4 group transition-all hover:border-zinc-700 active:scale-[0.99] shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-zinc-950 flex items-center justify-center border border-zinc-800 shadow-inner shrink-0 group-hover:border-primary/30 transition-colors">
            <Mail className="w-5 h-5 text-zinc-500 group-hover:text-primary transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-base font-black text-white truncate max-w-[200px]">
                {item.fromName || "Unknown Sender"}
              </h3>
              <span className="text-[10px] font-bold text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 truncate">
                {item.from}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-primary uppercase tracking-widest">{displayDate}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-800" />
              <span className="text-[11px] font-bold text-zinc-500 truncate">{item.address}</span>
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
          className="h-10 w-10 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="pt-1">
        <h4 className="text-lg font-bold text-white leading-tight mb-2 group-hover:text-primary transition-colors">
          {item.subject || "(No Subject)"}
        </h4>
        {item.intro && (
          <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed font-medium">
            {item.intro}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50 mt-1">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          <Clock className="w-3.5 h-3.5" />
          Archive Record
        </div>
        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest">
          Saved Securely
        </div>
      </div>
    </motion.div>
  )
}
