"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Zap, Shield, Mail, Clock, Copy, Trash2, RefreshCw,
  ArrowRight, Star, Eye, Lock,
  Globe, Sparkles, MousePointerClick
} from "lucide-react"
import { staggerContainer, staggerItem } from "@/animations"

// ─── HERO SECTION ───────────────────────────────────────────────
function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 150])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.97])

  return (
    <section ref={ref} className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute inset-0 radial-glow" />

      {/* Animated orbs */}
      <motion.div
        style={{ y }}
        className="absolute top-20 left-[15%] w-72 h-72 rounded-full bg-primary/10 blur-[100px] animate-float"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
        className="absolute bottom-20 right-[10%] w-96 h-96 rounded-full bg-accent/10 blur-[120px] animate-float"
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <motion.div style={{ opacity, scale }} className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Free & Secure — No Signup Required
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
        >
          Instant Temporary Email.{" "}
          <span className="gradient-text">No Signup Required.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Protect your privacy with secure disposable emails. Generate, receive, and delete — all in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/dashboard">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white text-base px-8 h-13 border-0 gap-2 shadow-lg shadow-primary/25 group">
                <div className="w-5 h-5 overflow-hidden rounded-sm transition-transform group-hover:scale-110">
                  <img src="/logo.png" alt="" className="w-full h-full object-contain brightness-0 invert" />
                </div>
                Get Temporary Email
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 flex items-center justify-center gap-8 sm:gap-16"
        >
          {[
            { value: "10M+", label: "Emails Generated" },
            { value: "99.9%", label: "Uptime" },
            { value: "< 1s", label: "Delivery Time" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
          <div className="w-1 h-2.5 rounded-full bg-muted-foreground/40" />
        </div>
      </motion.div>
    </section>
  )
}

// ─── FEATURES SECTION ───────────────────────────────────────────
const features = [
  {
    icon: () => <img src="/logo.png" alt="" className="w-6 h-6 object-contain brightness-0 invert" />,
    title: "Lightning Fast",
    description: "Generate and receive emails in under 1 second. No delays, no waiting.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your real email stays hidden. No personal information required.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Lock,
    title: "Zero Spam",
    description: "Keep your primary inbox clean. Use temp emails for signups and verifications.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Globe,
    title: "Free Forever",
    description: "No credit card, no hidden fees. Generate unlimited temporary emails.",
    gradient: "from-purple-500 to-pink-500",
  },
]

function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="features" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">Features</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything you need for{" "}
            <span className="gradient-text">private email</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple, fast, and secure. SwiftMail gives you disposable email addresses with all the features you need.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="group relative overflow-hidden border-border/50 hover:border-primary/20 transition-all duration-300 hover-lift h-full">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-6 relative">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm p-2.5`}>
                    <feature.icon />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── HOW IT WORKS SECTION ───────────────────────────────────────
const steps = [
  {
    icon: MousePointerClick,
    title: "Generate Email",
    description: "Click one button to instantly create a unique disposable email address.",
  },
  {
    icon: Mail,
    title: "Receive Messages",
    description: "Emails arrive in real-time. Auto-refresh keeps your inbox updated.",
  },
  {
    icon: Eye,
    title: "Stay Anonymous",
    description: "Read, copy, or delete. Your identity stays completely private.",
  },
]

function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section id="how-it-works" className="py-24 sm:py-32 bg-muted/30 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">How It Works</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Three steps to <span className="gradient-text">privacy</span>
          </h2>
          <p className="text-muted-foreground">It&apos;s ridiculously simple. Here&apos;s how.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-[2px]">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-primary/20 via-primary to-primary/20 origin-left"
            />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className="relative inline-flex mb-6">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  className="w-16 h-16 rounded-22xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25 p-3.5"
                >
                  <img src="/logo.png" alt="" className="w-full h-full object-contain brightness-0 invert" />
                </motion.div>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-background border-2 border-primary flex items-center justify-center text-xs font-bold text-primary shadow-sm">
                  {i + 1}
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── LIVE DEMO SECTION ────────────────────────────────────────
function LiveDemoSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const [typedEmail, setTypedEmail] = useState("")
  const fullEmail = "user7x9k2m@swiftmail.dev"

  useEffect(() => {
    if (!isInView) return
    let i = 0
    const interval = setInterval(() => {
      if (i <= fullEmail.length) {
        setTypedEmail(fullEmail.slice(0, i))
        i++
      } else {
        clearInterval(interval)
      }
    }, 55)
    return () => clearInterval(interval)
  }, [isInView])

  const demoMessages = [
    { from: "verify@github.com", subject: "Verify your email address", time: "Just now", unread: true },
    { from: "welcome@notion.so", subject: "Welcome to Notion!", time: "2m ago", unread: true },
    { from: "noreply@stripe.com", subject: "Your one-time passcode", time: "5m ago", unread: false },
  ]

  return (
    <section id="demo" className="py-24 sm:py-32 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">Live Preview</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            See it in <span className="gradient-text">action</span>
          </h2>
          <p className="text-muted-foreground">Watch how SwiftMail works — emails arrive instantly.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="overflow-hidden border-border/50 shadow-2xl shadow-primary/5 hover-glow transition-all duration-500">
            {/* Toolbar */}
            <div className="bg-muted/50 border-b border-border/50 px-4 sm:px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="h-8 px-4 bg-background rounded-lg border border-border/50 flex items-center gap-2 text-sm">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span className="font-mono text-xs">
                    {typedEmail}
                    <span className="animate-pulse text-primary">|</span>
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 px-3 bg-primary/10 rounded-lg flex items-center gap-1.5 text-xs font-medium text-primary cursor-pointer hover:bg-primary/15 transition-colors">
                  <Copy className="w-3 h-3" /> Copy
                </div>
                <div className="hidden sm:flex h-8 px-3 bg-muted rounded-lg items-center gap-1.5 text-xs font-medium text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors">
                  <RefreshCw className="w-3 h-3" /> Refresh
                </div>
              </div>
            </div>

            {/* Messages */}
            <CardContent className="p-0">
              {demoMessages.map((msg, i) => (
                <motion.div
                  key={msg.subject}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.2 }}
                  className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 border-b border-border/30 hover:bg-muted/50 transition-colors cursor-pointer ${msg.unread ? "bg-primary/[0.02]" : ""}`}
                >
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${msg.unread ? "bg-primary shadow-sm shadow-primary/50" : "bg-transparent"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm truncate ${msg.unread ? "font-semibold" : "font-medium text-muted-foreground"}`}>{msg.from}</p>
                      <span className="text-xs text-muted-foreground ml-4 flex-shrink-0">{msg.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{msg.subject}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex-shrink-0">
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

// ─── TESTIMONIALS SECTION ───────────────────────────────────────
const testimonials = [
  { name: "Alex Chen", role: "Developer", text: "SwiftMail is my go-to for testing. Instant emails, no hassle. Saves me hours every week.", rating: 5 },
  { name: "Sarah Miller", role: "Privacy Advocate", text: "Finally, a temp mail service that's fast, clean, and actually works. The dark mode is gorgeous.", rating: 5 },
  { name: "James Park", role: "Student", text: "I use it for all my free trial signups. No more spam in my real inbox!", rating: 5 },
]

function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section className="py-24 sm:py-32 bg-muted/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="mb-4">Testimonials</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Loved by <span className="gradient-text">thousands</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="border-border/50 hover:border-primary/20 transition-all duration-300 hover-lift h-full">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


// ─── CTA SECTION ───────────────────────────────────────────────
function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section className="py-24 sm:py-32 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary via-accent to-purple-600 text-white shadow-2xl shadow-primary/20 relative">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
            </div>
            {/* Glow orbs */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />

            <CardContent className="p-10 sm:p-16 text-center relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Start Using Temporary Email Now
              </h2>
              <p className="text-white/80 max-w-xl mx-auto mb-8 leading-relaxed">
                Join thousands of users protecting their privacy. It takes less than a second.
              </p>
              <Link href="/dashboard">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-base px-8 h-13 gap-2 shadow-xl border-0 font-semibold group">
                    <div className="w-5 h-5 overflow-hidden rounded-sm transition-transform group-hover:scale-110">
                      <img src="/logo.png" alt="" className="w-full h-full object-contain" />
                    </div>
                    Generate Email
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

// ─── PAGE ───────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <LiveDemoSection />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
