"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Zap, Inbox, Clock, Settings, User, LogOut, Menu, X, ChevronRight
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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const { showBanner } = useAdMob()
  const router = useRouter()

  useEffect(() => {
    // Show banner ad when entering dashboard layout
    showBanner();
  }, [showBanner]);

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out")
      router.push("/")
    } catch {
      toast.error("Failed to logout")
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col border-r border-border/50 bg-card/50">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">SwiftMail</span>
          </Link>
        </div>

        <ScrollArea className="flex-1 px-3">
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
              const isInbox = item.href === "/dashboard" && pathname === "/dashboard"
              const active = isActive || isInbox

              return (
                <Link key={item.href} href={item.href}>
                  <div className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? "text-primary bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                    <item.icon className="w-4.5 h-4.5" />
                    {item.label}
                    {active && (
                      <motion.div layoutId="activeSidebar" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                    )}
                  </div>
                </Link>
              )
            })}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t border-border/50 space-y-2">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user?.displayName?.[0] || user?.email?.[0] || "G"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user?.displayName || "Guest"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || "Not signed in"}</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div 
        className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border/50"
        style={{ paddingTop: 'var(--safe-area-top)' }}
      >
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">SwiftMail</span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", damping: 25 }} className="md:hidden fixed left-0 top-0 bottom-[80px] z-50 w-72 bg-card border-r border-border/50 flex flex-col shadow-2xl">
              <div className="p-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold gradient-text">SwiftMail</span>
                </Link>
                <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
              </div>
              <nav className="flex-1 px-3 space-y-1">
                {sidebarItems.map((item) => {
                  const active = pathname === item.href
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                      <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? "text-primary bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                        <item.icon className="w-4.5 h-4.5" />
                        {item.label}
                        <ChevronRight className="w-4 h-4 ml-auto opacity-30" />
                      </div>
                    </Link>
                  )
                })}
              </nav>
              <div className="p-4 border-t border-border/50">
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" /> Logout
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main 
        className="flex-1 overflow-auto pb-20 md:pb-0 md:pt-0"
        style={{ paddingTop: 'calc(3.5rem + var(--safe-area-top))' }}
      >
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}
