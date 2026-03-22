"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Shield, Trash2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTempMail } from "@/hooks/use-temp-mail"
import { useHistory } from "@/hooks/use-history"

export default function ProfilePage() {
  const { account, deleteAccount } = useTempMail()
  const { history } = useHistory()

  return (
    <div className="p-6 max-w-2xl mx-auto h-full overflow-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <User className="w-6 h-6 text-primary" /> Profile
        </h1>

        <Card className="border-border/50 mb-6 relative overflow-hidden">
          <div className="absolute top-0 w-full h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
          <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-xl shadow-primary/25 border-4 border-background">
              {account?.address[0].toUpperCase() || "G"}
            </div>
            <h2 className="text-xl font-bold mb-1">Temporary User</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {account ? account.address : "No active email addresses."}
            </p>
            <Badge variant="secondary" className="gap-1.5 px-3 py-1">
              <Shield className="w-3.5 h-3.5 text-primary" /> Secure & Anonymous
            </Badge>
          </CardContent>
        </Card>

        {/* Details */}
        <Card className="border-border/50">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Active Session Details</h2>
            </div>
            <Separator />
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Current Address</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {account ? account.address : "None generated"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Total Emails Received</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {history.length} emails saved in your local history
                  </p>
                </div>
              </div>
            </div>

            {account && (
              <>
                <Separator className="my-6" />
                <div>
                   <Button variant="destructive" className="w-full sm:w-auto" onClick={deleteAccount}>
                     <Trash2 className="w-4 h-4 mr-2" />
                     Delete Current Inbox
                   </Button>
                   <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                     Deleting this inbox will permanently destroy the email address. However, any previously received emails are still preserved in your local history tab until cleared.
                   </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
