"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  User, Mail, Shield, Trash2, Clock, AlertTriangle,
  CheckCircle2, Copy, HardDrive, ShieldCheck
} from "lucide-react"
import { useTempMail } from "@/hooks/use-temp-mail"
import { useHistory } from "@/hooks/use-history"
import { copyToClipboard } from "@/lib/utils"
import { toast } from "sonner"
import { staggerContainer, staggerItem } from "@/animations"

export default function ProfilePage() {
  const { account, deleteAccount } = useTempMail()
  const { history, clearHistory } = useHistory()
  const [copied, setCopied] = useState(false)
  const [showDangerConfirm, setShowDangerConfirm] = useState(false)

  const handleCopy = async () => {
    if (!account) return
    await copyToClipboard(account.address)
    setCopied(true)
    toast.success("Copied to clipboard!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDeleteAccount = () => {
    deleteAccount()
    setShowDangerConfirm(false)
    toast.success("Inbox deleted successfully")
  }

  // Estimate local storage size
  const storageUsed = (() => {
    try {
      const data = localStorage.getItem("swiftmail_history") || "[]"
      const bytes = new Blob([data]).size
      if (bytes < 1024) return `${bytes} B`
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    } catch {
      return "0 B"
    }
  })()

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
            <User className="w-6 h-6 text-primary" /> Profile
          </h1>
        </motion.div>

        {/* Avatar Card */}
        <motion.div variants={staggerItem}>
          <Card className="border-border/50 mb-6 relative overflow-hidden">
            <div className="absolute top-0 w-full h-28 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
            <CardContent className="p-6 sm:p-8 flex flex-col items-center text-center relative z-10">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-primary/25 border-4 border-background">
                  {account?.address[0]?.toUpperCase() || "G"}
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-card border-2 border-background flex items-center justify-center shadow-sm">
                  {account ? (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  ) : (
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
              <h2 className="text-xl font-bold mb-1">Temporary User</h2>
              <p className="text-sm text-muted-foreground mb-3 font-mono">
                {account ? account.address : "No active email address"}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Anonymous
                </Badge>
                {account && (
                  <Badge variant="outline" className="gap-1.5 px-3 py-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Active
                  </Badge>
                )}
              </div>
              {account && (
                <Button
                  variant="outline"
                  size="sm"
                  className={`mt-4 gap-1.5 transition-all ${copied ? "bg-success/10 border-success/30 text-success" : ""}`}
                  onClick={handleCopy}
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy Address"}
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Session Details */}
        <motion.div variants={staggerItem}>
          <Card className="border-border/50 mb-6">
            <CardContent className="p-5 sm:p-6">
              <h2 className="font-semibold text-lg mb-4">Session Details</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Current Address</p>
                    <p className="text-xs text-muted-foreground truncate">{account ? account.address : "None generated"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Emails in History</p>
                    <p className="text-xs text-muted-foreground">{history.length} emails saved locally</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">{history.length}</Badge>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <HardDrive className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Local Storage Used</p>
                    <p className="text-xs text-muted-foreground">{storageUsed} of device storage</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="p-2 rounded-lg bg-success/10">
                    <Shield className="w-4 h-4 text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Privacy Status</p>
                    <p className="text-xs text-muted-foreground">All data stored locally — nothing on servers</p>
                  </div>
                  <Badge className="bg-success/10 text-success border-success/20 text-xs">Protected</Badge>
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
                <AlertTriangle className="w-4 h-4" /> Danger Zone
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                These actions are irreversible. Please proceed with caution.
              </p>

              <div className="space-y-3">
                {account && (
                  <div className="flex items-center justify-between p-3 rounded-lg border border-destructive/10 bg-background">
                    <div>
                      <p className="text-sm font-medium">Delete Current Inbox</p>
                      <p className="text-xs text-muted-foreground">Permanently destroy this email address</p>
                    </div>
                    <AnimatePresence mode="wait">
                      {!showDangerConfirm ? (
                        <motion.div key="delete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-destructive/30 text-destructive hover:bg-destructive hover:text-white gap-1.5"
                            onClick={() => setShowDangerConfirm(true)}
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div key="confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setShowDangerConfirm(false)}>
                            Cancel
                          </Button>
                          <Button variant="destructive" size="sm" onClick={handleDeleteAccount} className="gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" /> Confirm
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {history.length > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-lg border border-destructive/10 bg-background">
                    <div>
                      <p className="text-sm font-medium">Clear All History</p>
                      <p className="text-xs text-muted-foreground">Remove {history.length} saved emails from device</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-destructive/30 text-destructive hover:bg-destructive hover:text-white gap-1.5"
                      onClick={() => {
                        clearHistory()
                        toast.success("History cleared")
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Clear
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
