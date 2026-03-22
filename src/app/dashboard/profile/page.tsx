"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Calendar, Crown, Edit2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

export default function ProfilePage() {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.displayName || "Guest User")

  const handleSave = () => {
    setEditing(false)
    toast.success("Profile updated")
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <User className="w-6 h-6 text-primary" /> Profile
        </h1>

        {/* Avatar Card */}
        <Card className="border-border/50 mb-6">
          <CardContent className="p-8 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-primary/25">
              {(user?.displayName || user?.email || "G")[0].toUpperCase()}
            </div>
            <h2 className="text-xl font-bold mb-1">{user?.displayName || "Guest User"}</h2>
            <p className="text-sm text-muted-foreground mb-3">{user?.email || "Not signed in"}</p>
            <Badge variant="secondary" className="gap-1">
              <Crown className="w-3 h-3" /> Free Plan
            </Badge>
          </CardContent>
        </Card>

        {/* Details */}
        <Card className="border-border/50">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Account Details</h2>
              <Button variant="ghost" size="sm" className="gap-1.5" onClick={() => editing ? handleSave() : setEditing(true)}>
                <Edit2 className="w-3.5 h-3.5" /> {editing ? "Save" : "Edit"}
              </Button>
            </div>
            <Separator />
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Display Name</Label>
                {editing ? (
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
                ) : (
                  <p className="text-sm font-medium mt-1">{user?.displayName || "Guest User"}</p>
                )}
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Email</Label>
                <p className="text-sm font-medium mt-1 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  {user?.email || "Not signed in"}
                </p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Account Type</Label>
                <p className="text-sm font-medium mt-1 flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5 text-primary" /> Free Plan
                </p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Member Since</Label>
                <p className="text-sm font-medium mt-1 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
