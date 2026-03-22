"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"


import { ThemeToggle } from "@/components/theme-toggle"
import {
  Zap, Inbox, Clock, Settings, User, LogOut, WifiOff
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useAdMob } from "@/hooks/use-admob"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useEffect } from "react"

const sidebarItems = [
  { href: "/dashboard", icon: Inbox, label: "Inbox" },
  { href: "/dashboard/history", icon: Clock, label: "History" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
]

// ─── OFFLINE BANNER ───────────────────────────────────────────
function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const goOffline = () => setIsOffline(true)
    const goOnline = () => setIsOffline(false)
    setIsOffline(!navigator.onLine)
    window.addEventListener("offline", goOffline)
    window.addEventListener("online", goOnline)
    return () => {
      window.removeEventListener("offline", goOffline)
      window.removeEventListener("online", goOnline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-destructive text-destructive-foreground px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-medium shadow-sm transition-all"
        >
          <WifiOff className="w-4 h-4" />
          <span>You&apos;re currently browsing offline</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { showBanner } = useAdMob()
  const router = useRouter()

  useEffect(() => {
    showBanner()
  }, [showBanner])

  const handleLogout = useCallback(async () => {
    try {
      await logout()
      toast.success("Logged out")
      router.push("/")
    } catch {
      toast.error("Failed to logout")
    }
  }, [logout, router])

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div 
        className="flex-1 flex flex-col h-screen overflow-hidden"
        style={{ paddingTop: 'var(--safe-area-top)' }}
      >
        <OfflineBanner />
        <main className="flex-1 overflow-auto pb-48 md:pb-0">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>

        {/* ─── MOBILE BOTTOM NAV ────────────────────────────── */}
        <nav
          className="md:hidden fixed left-0 right-0 z-40 glass-elevated border-t border-border/50"
          style={{ 
            bottom: 'calc(100px + var(--safe-area-bottom))'
          }}
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-around h-16 px-2">
            {sidebarItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex flex-col items-center justify-center gap-0.5 w-16 py-1"
                  aria-current={active ? "page" : undefined}
                >
                  <motion.div
                    className={`p-1.5 rounded-xl transition-colors ${active ? "bg-primary/10" : ""}`}
                    whileTap={{ scale: 0.9 }}
                  >
                    <item.icon
                      className={`w-5 h-5 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
                    />
                  </motion.div>
                  <span className={`text-[10px] font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}>
                    {item.label}
                  </span>
                  {active && (
                    <motion.div
                      layoutId="activeBottomNav"
                      className="absolute -top-0.5 w-8 h-[3px] rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}
