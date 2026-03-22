"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Settings, Moon, Bell, Trash2, Shield, AlertTriangle } from "lucide-react"
import { useTheme } from "next-themes"
import { toast } from "sonner"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <Settings className="w-6 h-6 text-primary" /> Settings
        </h1>

        {/* Appearance */}
        <Card className="border-border/50 mb-6">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><Moon className="w-4 h-4" /> Appearance</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Toggle between light and dark theme</p>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-border/50 mb-6">
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Get notified when new emails arrive</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Auto Refresh</p>
                <p className="text-xs text-muted-foreground">Auto refresh inbox every 5 seconds</p>
              </div>
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="border-border/50 mb-6">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><Shield className="w-4 h-4" /> Privacy</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email History</p>
                <p className="text-xs text-muted-foreground">Clear all saved email history</p>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success("History cleared")}>
                <Trash2 className="w-3.5 h-3.5" /> Clear History
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/30">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-4 h-4" /> Danger Zone
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Delete Account</p>
                <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive" size="sm" className="gap-1.5" onClick={() => toast.error("This action is irreversible. Please contact support.")}>
                <Trash2 className="w-3.5 h-3.5" /> Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
