"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Shield, Mail, Clock, RefreshCw, Copy, Trash2, Lock, Globe, Smartphone, Bell, Key, Database, Wifi } from "lucide-react"

const features = [
  { icon: Zap, title: "Instant Generation", description: "Create a new email address in milliseconds. One click is all it takes.", color: "from-amber-500 to-orange-500" },
  { icon: Shield, title: "Complete Privacy", description: "No personal information required. We don't track or store your data.", color: "from-green-500 to-emerald-500" },
  { icon: Mail, title: "Real-time Inbox", description: "Emails arrive instantly with auto-refresh. Never miss a message.", color: "from-blue-500 to-cyan-500" },
  { icon: Clock, title: "Auto Cleanup", description: "Emails are automatically deleted after expiration. Zero trace left behind.", color: "from-purple-500 to-violet-500" },
  { icon: Copy, title: "One-Click Copy", description: "Copy your temp email to clipboard instantly with a single click.", color: "from-pink-500 to-rose-500" },
  { icon: RefreshCw, title: "Regenerate Anytime", description: "Need a fresh email? Generate a new one whenever you want.", color: "from-teal-500 to-cyan-500" },
  { icon: Lock, title: "Secure by Design", description: "End-to-end encrypted communications. Your messages stay private.", color: "from-indigo-500 to-blue-500" },
  { icon: Smartphone, title: "Mobile Friendly", description: "Works perfectly on any device. Available as a mobile app too.", color: "from-orange-500 to-red-500" },
  { icon: Bell, title: "Notifications", description: "Get notified when new emails arrive. Never miss an important verification.", color: "from-yellow-500 to-amber-500" },
  { icon: Key, title: "No Signup Required", description: "Start using immediately. No account, no password, no hassle.", color: "from-emerald-500 to-green-500" },
  { icon: Database, title: "Email History", description: "Logged-in users can save and access their email history anytime.", color: "from-violet-500 to-purple-500" },
  { icon: Wifi, title: "API Access", description: "Pro users get full API access for automation and integration.", color: "from-cyan-500 to-blue-500" },
]

export default function FeaturesPage() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-20">
          <Badge variant="secondary" className="mb-4">Features</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Built for <span className="gradient-text">speed & privacy</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            SwiftMail comes packed with everything you need for temporary email management.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.05 }}>
              <Card className="group border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 h-full">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
