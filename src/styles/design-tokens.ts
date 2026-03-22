// SwiftMail Design Tokens
// Centralized design system constants

export const colors = {
  primary: {
    DEFAULT: "#4f46e5",
    light: "#818cf8",
    dark: "#3730a3",
    foreground: "#ffffff",
  },
  accent: {
    DEFAULT: "#9333ea",
    light: "#a78bfa",
    dark: "#7c3aed",
    foreground: "#ffffff",
  },
  background: {
    light: "#fafafc",
    dark: "#09090b",
  },
  card: {
    light: "#ffffff",
    dark: "#111118",
  },
  muted: {
    light: "#f4f3ff",
    dark: "#161622",
    foreground: { light: "#6b7280", dark: "#9ca3af" },
  },
  destructive: "#ef4444",
  success: "#22c55e",
  warning: "#f59e0b",
  info: "#3b82f6",
} as const

export const gradients = {
  primary: "linear-gradient(to right, #4f46e5, #9333ea)",
  accent: "linear-gradient(135deg, #818cf8, #a78bfa)",
  glass: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
  glow: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99, 102, 241, 0.2), transparent)",
  hero: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(79, 70, 229, 0.15), transparent)",
  cta: "linear-gradient(135deg, #4f46e5, #9333ea, #7c3aed)",
  card: "linear-gradient(135deg, rgba(79, 70, 229, 0.05), rgba(147, 51, 234, 0.05))",
  border: "linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(147, 51, 234, 0.2))",
} as const

export const spacing = {
  xs: "0.25rem",    // 4px
  sm: "0.5rem",     // 8px
  md: "1rem",       // 16px
  lg: "1.5rem",     // 24px
  xl: "2rem",       // 32px
  "2xl": "3rem",    // 48px
  "3xl": "4rem",    // 64px
  "4xl": "6rem",    // 96px
  section: "6rem",  // Section padding
  sectionMobile: "3rem",
} as const

export const radius = {
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.25rem",
  full: "9999px",
} as const

export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  glow: "0 0 20px rgba(99, 102, 241, 0.15)",
  glowLg: "0 0 40px rgba(99, 102, 241, 0.2)",
  card: "0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)",
  cardHover: "0 8px 30px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.06)",
  elevated: "0 12px 40px rgba(0, 0, 0, 0.12)",
} as const

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  banner: 30,
  overlay: 40,
  modal: 50,
  popover: 60,
  toast: 70,
  tooltip: 80,
} as const

export const motion = {
  duration: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
    page: 0.4,
  },
  ease: {
    default: [0.25, 0.1, 0.25, 1],
    in: [0.4, 0, 1, 1],
    out: [0, 0, 0.2, 1],
    inOut: [0.4, 0, 0.2, 1],
    spring: { type: "spring" as const, stiffness: 300, damping: 30 },
    bounce: { type: "spring" as const, stiffness: 400, damping: 25 },
  },
} as const

export const typography = {
  hero: "text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]",
  title: "text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight",
  subtitle: "text-lg sm:text-xl text-muted-foreground",
  body: "text-sm sm:text-base text-foreground leading-relaxed",
  caption: "text-xs text-muted-foreground",
  label: "text-sm font-medium",
  mono: "font-mono text-sm",
} as const

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const
