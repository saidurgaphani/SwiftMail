"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Settings, Moon, Bell, Trash2, Shield, AlertTriangle,
  HardDrive, RotateCcw, Smartphone, Info
} from "lucide-react"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { staggerContainer, staggerItem } from "@/animations"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [storageSize, setStorageSize] = useState("0 B")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load preferences from localStorage
    const prefs = localStorage.getItem("swiftmail_prefs")
    if (prefs) {
      try {
        const parsed = JSON.parse(prefs)
        setNotifications(parsed.notifications ?? true)
        setAutoRefresh(parsed.autoRefresh ?? true)
      } catch { /* ignore */ }
    }
    calculateStorageSize()
  }, [])

  const calculateStorageSize = () => {
    try {
      let total = 0
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith("swiftmail")) {
          total += new Blob([localStorage.getItem(key) || ""]).size
        }
      }
      if (total < 1024) setStorageSize(`${total} B`)
      else if (total < 1024 * 1024) setStorageSize(`${(total / 1024).toFixed(1)} KB`)
      else setStorageSize(`${(total / (1024 * 1024)).toFixed(1)} MB`)
    } catch {
      setStorageSize("Unknown")
    }
  }

  const savePrefs = (key: string, value: boolean) => {
    try {
      const prefs = JSON.parse(localStorage.getItem("swiftmail_prefs") || "{}")
      prefs[key] = value
      localStorage.setItem("swiftmail_prefs", JSON.stringify(prefs))
    } catch { /* ignore */ }
  }

  const handleNotificationsChange = (checked: boolean) => {
    setNotifications(checked)
    savePrefs("notifications", checked)
    toast.success(checked ? "Notifications enabled" : "Notifications disabled")
  }

  const handleAutoRefreshChange = (checked: boolean) => {
    setAutoRefresh(checked)
    savePrefs("autoRefresh", checked)
    toast.success(checked ? "Auto-refresh enabled" : "Auto-refresh disabled")
  }

  const handleClearCache = () => {
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("swiftmail") && key !== "swiftmail_prefs") {
        keys.push(key)
      }
    }
    keys.forEach(key => localStorage.removeItem(key))
    calculateStorageSize()
    toast.success("Cache cleared successfully")
  }

  const handleResetApp = () => {
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("swiftmail")) {
        keys.push(key)
      }
    }
    keys.forEach(key => localStorage.removeItem(key))
    toast.success("App reset. Reloading...")
    setTimeout(() => window.location.reload(), 1000)
  }

  if (!mounted) return null

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto h-full overflow-auto">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div variants={staggerItem}>
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <Settings className="w-6 h-6 text-primary" /> Settings
          </h1>
        </motion.div>

        {/* Appearance */}
        <motion.div variants={staggerItem}>
          <Card className="border-border/50 mb-4">
            <CardContent className="p-5 sm:p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Moon className="w-4 h-4 text-primary" /> Appearance
              </h2>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div>
                  <p className="text-sm font-medium">Dark Mode</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Toggle between light and dark theme</p>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  aria-label="Toggle dark mode"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={staggerItem}>
          <Card className="border-border/50 mb-4">
            <CardContent className="p-5 sm:p-6 space-y-3">
              <h2 className="font-semibold flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" /> Notifications
              </h2>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div>
                  <p className="text-sm font-medium">Email Notifications</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Get notified when new emails arrive</p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={handleNotificationsChange}
                  aria-label="Toggle email notifications"
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div>
                  <p className="text-sm font-medium">Auto Refresh</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Auto refresh inbox every 5 seconds</p>
                </div>
                <Switch
                  checked={autoRefresh}
                  onCheckedChange={handleAutoRefreshChange}
                  aria-label="Toggle auto refresh"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Storage & Privacy */}
        <motion.div variants={staggerItem}>
          <Card className="border-border/50 mb-4">
            <CardContent className="p-5 sm:p-6 space-y-3">
              <h2 className="font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> Privacy & Storage
              </h2>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <HardDrive className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Storage Used</p>
                    <p className="text-xs text-muted-foreground mt-0.5">SwiftMail data on this device</p>
                  </div>
                </div>
                <Badge variant="secondary" className="font-mono text-xs">{storageSize}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div>
                  <p className="text-sm font-medium">Clear Cache</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Remove saved emails and cached data</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 h-8"
                  onClick={handleClearCache}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </Button>
              </div>

              <div className="p-3 rounded-lg bg-info/5 border border-info/10 flex items-start gap-2">
                <Info className="w-4 h-4 text-info flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All data is stored locally on your device. SwiftMail never sends your emails to external servers.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* App Info */}
        <motion.div variants={staggerItem}>
          <Card className="border-border/50 mb-4">
            <CardContent className="p-5 sm:p-6">
              <h2 className="font-semibold flex items-center gap-2 mb-3">
                <Smartphone className="w-4 h-4 text-primary" /> About
              </h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-mono text-xs">0.1.0</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Framework</span>
                  <span className="font-mono text-xs">Next.js 16</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Platform</span>
                  <span className="font-mono text-xs">Web + Capacitor</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div variants={staggerItem}>
          <Card className="border-destructive/20 bg-destructive/[0.02]">
            <CardContent className="p-5 sm:p-6">
              <h2 className="font-semibold mb-1 flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-4 h-4" /> Reset App
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                This will clear all data including preferences, history, and cached accounts.
              </p>
              <Button
                variant="destructive"
                size="sm"
                className="gap-1.5"
                onClick={handleResetApp}
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Everything
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
