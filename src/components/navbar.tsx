"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Zap, ArrowRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const navItems = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#demo", label: "Demo" },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    
    // Handle initial hash on load or navigation
    if (window.location.hash && pathname === "/") {
      const id = window.location.hash.replace("#", "")
      const element = document.getElementById(id)
      if (element) {
        setTimeout(() => {
          const offset = 100
          const bodyRect = document.body.getBoundingClientRect().top
          const elementRect = element.getBoundingClientRect().top
          const elementPosition = elementRect - bodyRect
          const offsetPosition = elementPosition - offset

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          })
        }, 100) // Small delay to ensure layout is ready
      }
    }

    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  const handleSmoothScroll = (e: React.MouseEvent, href: string) => {
    if (href.startsWith("#")) {
      const id = href.replace("#", "")
      
      if (pathname !== "/") {
        // Just let the link handle cross-page navigation
        setMobileOpen(false)
        return
      }

      // On landing page, prevent default and handle manually
      e.preventDefault()
      
      // Close menu first if it's open
      const wasOpen = mobileOpen
      setMobileOpen(false)

      // Wait for menu to start closing before scrolling
      // This helps avoid layout shifts or scroll-locking issues on mobile
      const delay = wasOpen ? 300 : 0
      
      setTimeout(() => {
        const element = document.getElementById(id)
        if (element) {
          const offset = 100
          const bodyRect = document.body.getBoundingClientRect().top
          const elementRect = element.getBoundingClientRect().top
          const elementPosition = elementRect - bodyRect
          const offsetPosition = elementPosition - offset

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          })
        }
      }, delay)
    }
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-elevated border-b border-border/50 shadow-sm"
          : "bg-transparent"
      }`}
      style={{ paddingTop: 'var(--safe-area-top)' }}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex items-center justify-between"
          animate={{ height: scrolled ? 56 : 64 }}
          transition={{ duration: 0.2 }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="SwiftMail Home">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-10 h-10 rounded-xl overflow-hidden glass-elevated border border-border/50 p-1"
            >
              <img 
                src="/logo.png" 
                alt="SwiftMail Logo" 
                className="w-full h-full object-contain"
              />
            </motion.div>
            <span className="text-xl font-bold gradient-text">SwiftMail</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className="relative px-4 py-2 text-sm font-medium rounded-lg transition-colors text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link href="/dashboard">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white border-0 gap-1.5 shadow-sm shadow-primary/20">
                  Get Started <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </motion.div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-border/50 glass-elevated overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-primary to-accent text-white border-0 gap-1.5">
                    Get Started <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
