"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Zap } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to get started",
    features: [
      "Generate temporary emails",
      "Real-time inbox",
      "5 email history entries",
      "Auto-refresh inbox",
      "Copy email to clipboard",
      "Dark & light mode",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$4.99",
    period: "/month",
    description: "For power users and developers",
    features: [
      "Everything in Free",
      "Unlimited email history",
      "Custom email aliases",
      "Priority email delivery",
      "No auto-delete",
      "API access",
      "Priority support",
      "Custom domains",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
]

export default function PricingPage() {
  return (
    <div className="py-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-20">
          <Badge variant="secondary" className="mb-4">Pricing</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">
            Simple, <span className="gradient-text">transparent</span> pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">No hidden fees. Start free, upgrade when you need more power.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.15 }}>
              <Card className={`relative overflow-hidden h-full ${plan.popular ? "border-primary shadow-xl shadow-primary/10" : "border-border/50"}`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-accent text-white text-xs font-bold px-4 py-1 rounded-bl-lg">Most Popular</div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                  <div className="mb-8">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm"><Check className="w-4 h-4 text-primary flex-shrink-0" />{f}</li>
                    ))}
                  </ul>
                  <Link href="/dashboard">
                    <Button className={`w-full h-11 ${plan.popular ? "bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white border-0" : ""}`} variant={plan.popular ? "default" : "outline"}>
                      {plan.popular && <Zap className="w-4 h-4 mr-2" />}
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
