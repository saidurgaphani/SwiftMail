"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, MessageSquare, MapPin } from "lucide-react"
import { toast } from "sonner"

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Message sent! We'll get back to you soon.")
  }

  return (
    <div className="py-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Contact</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Get in <span className="gradient-text">touch</span></h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">Have a question or feedback? We&apos;d love to hear from you.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <Card className="border-border/50">
              <CardContent className="p-8">
                <h2 className="text-xl font-bold mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div><Label htmlFor="name">Name</Label><Input id="name" placeholder="Your name" className="mt-1.5" required /></div>
                  <div><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="you@example.com" className="mt-1.5" required /></div>
                  <div><Label htmlFor="message">Message</Label><textarea id="message" placeholder="How can we help?" className="mt-1.5 w-full min-h-[120px] rounded-lg border border-input bg-background px-3 py-2 text-sm" required /></div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white border-0">Send Message</Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-6">
            {[
              { icon: Mail, title: "Email", text: "support@swiftmail.dev" },
              { icon: MessageSquare, title: "Live Chat", text: "Available 9am-6pm EST" },
              { icon: MapPin, title: "Location", text: "San Francisco, CA" },
            ].map((item) => (
              <Card key={item.title} className="border-border/50">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
