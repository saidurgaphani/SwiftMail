"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"


import { ThemeToggle } from "@/components/theme-toggle"
import {
  Zap, Inbox, Clock, Settings, User, LogOut, Menu, X,
  ChevronRight, ChevronLeft, Wifi, WifiOff
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
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="bg-destructive/10 border-b border-destructive/20 px-4 py-2 flex items-center justify-center gap-2 text-sm"
    >
      <WifiOff className="w-3.5 h-3.5 text-destructive" />
      <span className="text-destructive font-medium">You&apos;re offline</span>
      <span className="text-destructive/70">— Some features may be unavailable</span>
    </motion.div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
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
      {/* ─── DESKTOP SIDEBAR ──────────────────────────────────── */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 72 : 256 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden md:flex flex-col border-r border-border/50 bg-card/30 backdrop-blur-sm relative overflow-hidden"
      >
        {/* Sidebar glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className={`p-4 ${sidebarCollapsed ? "px-3" : "px-6"} flex items-center justify-between`}>
          <Link href="/" className="flex items-center gap-2 group" aria-label="SwiftMail Home">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.4 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0"
            >
              <Zap className="w-5 h-5 text-white" />
            </motion.div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-lg font-bold gradient-text whitespace-nowrap overflow-hidden"
                >
                  SwiftMail
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Nav */}
        <ScrollArea className="flex-1 px-3">
          <nav className="space-y-1" role="navigation" aria-label="Dashboard navigation">
            {sidebarItems.map((item) => {
              const active = isActive(item.href)
              const linkContent = (
                <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}>
                  <motion.div
                    className={`relative flex items-center gap-3 ${sidebarCollapsed ? "justify-center px-2" : "px-3"} py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? "text-primary bg-primary/10 shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                    }`}
                    whileHover={!active ? { x: 2 } : {}}
                  >
                    <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? "text-primary" : ""}`} />
                    <AnimatePresence>
                      {!sidebarCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="whitespace-nowrap overflow-hidden"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {active && (
                      <motion.div
                        layoutId="activeSidebar"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-primary"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    {active && (
                      <div className="absolute inset-0 rounded-lg bg-primary/5 animate-pulse-ring pointer-events-none" />
                    )}
                  </motion.div>
                </Link>
              )

              if (sidebarCollapsed) {
                return (
                  <div key={item.href} title={item.label}>
                    {linkContent}
                  </div>
                )
              }

              return <div key={item.href}>{linkContent}</div>
            })}
          </nav>

          {sidebarCollapsed && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </ScrollArea>

        {/* User Section */}
        <div className="p-3 border-t border-border/50">
          {!sidebarCollapsed ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                  {user?.displayName?.[0] || user?.email?.[0] || "G"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.displayName || "Guest"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email || "Anonymous"}</p>
                </div>
                <ThemeToggle />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="p-2 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </motion.aside>

      {/* ─── MOBILE HEADER ────────────────────────────────────── */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 glass-elevated border-b border-border/50"
        style={{ paddingTop: 'var(--safe-area-top)' }}
      >
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/" className="flex items-center gap-2" aria-label="SwiftMail Home">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">SwiftMail</span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ─── MOBILE SIDEBAR OVERLAY ───────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="md:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-card border-r border-border/50 flex flex-col shadow-2xl"
              style={{ paddingBottom: 'calc(80px + var(--safe-area-bottom))' }}
            >
              <div className="p-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold gradient-text">SwiftMail</span>
                </Link>
                <button onClick={() => setSidebarOpen(false)} aria-label="Close menu">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 px-3 space-y-1">
                {sidebarItems.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                      <motion.div
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                          active
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                        whileTap={{ scale: 0.98 }}
                      >
                        <item.icon className={`w-[18px] h-[18px] ${active ? "text-primary" : ""}`} />
                        {item.label}
                        <ChevronRight className="w-4 h-4 ml-auto opacity-30" />
                      </motion.div>
                    </Link>
                  )
                })}
              </nav>

              <div className="p-4 border-t border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" /> Logout
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ─── MAIN CONTENT ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <OfflineBanner />
        <main
          className="flex-1 overflow-auto pb-20 md:pb-0 md:pt-0"
          style={{ paddingTop: 'calc(3.5rem + var(--safe-area-top))' }}
        >
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
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-elevated border-t border-border/50"
          style={{ paddingBottom: 'var(--safe-area-bottom)' }}
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
