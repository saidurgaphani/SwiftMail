"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { MousePointerClick, Mail, Eye, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const steps = [
  { icon: MousePointerClick, title: "Generate Email", description: "Click the 'Generate Email' button and instantly receive a unique, disposable email address. No forms, no signup, no waiting.", detail: "Our system creates a real email address using the Mail.tm network. The address is fully functional and ready to receive emails immediately." },
  { icon: Mail, title: "Receive Messages", description: "Use your temporary email for signups, verifications, or any purpose. Emails appear in your inbox in real-time.", detail: "Auto-refresh checks for new messages every 5 seconds. You'll see sender, subject, and preview instantly. Open any email to read the full content." },
  { icon: Eye, title: "Stay Anonymous", description: "Read your emails, copy what you need, and delete when done. Your real identity stays completely private.", detail: "We don't store any personal data. Emails are temporary by design. When you're done, simply close the tab or generate a new address." },
]

export default function HowItWorksPage() {
  return (
    <div className="py-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-20">
          <Badge variant="secondary" className="mb-4">How It Works</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Privacy in <span className="gradient-text">three steps</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">No complex setup. No account required. Just instant temporary email.</p>
        </motion.div>

        <div className="space-y-16">
          {steps.map((step, i) => (
            <motion.div key={step.title} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.15 }} className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
                    <step.icon className="w-9 h-9 text-white" />
                  </div>
                  <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center text-sm font-bold text-primary">{i + 1}</div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground mb-3 text-lg">{step.description}</p>
                <p className="text-sm text-muted-foreground/80 leading-relaxed">{step.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="text-center mt-20">
          <Link href="/dashboard">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white text-base px-8 h-12 border-0 gap-2">
              Try It Now <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
