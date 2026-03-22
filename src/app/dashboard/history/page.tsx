"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Search, Trash2, Mail } from "lucide-react"
import { formatDate } from "@/lib/utils"

import { useHistory } from "@/hooks/use-history"

export default function HistoryPage() {
  const [search, setSearch] = useState("")
  const { history, deleteFromHistory, clearHistory } = useHistory()

  const filtered = history.filter(
    (h) =>
      h.subject.toLowerCase().includes(search.toLowerCase()) ||
      h.from.toLowerCase().includes(search.toLowerCase()) ||
      h.address.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (id: string) => {
    deleteFromHistory(id)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border/50 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" /> Email History
          </h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{history.length} emails</Badge>
            {history.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearHistory} className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive">
                Clear All
              </Button>
            )}
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search history..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Mail className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-1">No history found</h3>
            <p className="text-sm text-muted-foreground">Your saved email history will appear here.</p>
          </div>
        ) : (
          filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border-b border-border/30 hover:bg-muted/50 transition-colors px-4 py-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0 mt-1">
                  {item.from[0]?.toUpperCase() || "M"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.subject}</p>
                  <p className="text-xs text-muted-foreground truncate">From: {item.from}</p>
                  {item.intro && (
                    <p className="text-xs text-foreground/80 mt-2 line-clamp-3 leading-relaxed border-l-2 border-primary/20 pl-2">
                      {item.intro}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline" className="text-xs font-mono">{item.address}</Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(item.receivedAt)}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive flex-shrink-0" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </ScrollArea>
    </div>
  )
}
