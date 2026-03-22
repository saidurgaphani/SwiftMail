# SwiftMail Frontend Architecture & Design Guide

## 🏛 Core Architecture
SwiftMail is a highly reactive, mobile-first Web Application built on modern web technologies.

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router paradigm) inside the `src/app` directory. React 19 handles all UI component life cycles.
- **Native Wrapper**: [Capacitor](https://capacitorjs.com/) converts the fully compiled HTML/CSS Next.js output (`out` directory) into a local Android and iOS web view.
- **State Management**: Handled primarily via custom React Hooks (`useTempMail`, `useHistory`), avoiding heavy external state management libraries. `localStorage` acts as a fast offline database.
- **Styling Pipeline**: [Tailwind CSS v3](https://tailwindcss.com/) powers all utility classes, deeply integrated into the overarching CSS variables in `globals.css`.

---

## 🎨 UI & Design Principles
The application revolves around a **Premium Dark-Mode First** aesthetic.

- **Color Palette & Branding**: 
  - Dynamic gradient themes using `Primary` (Indigo `#4f46e5`) bridging into `Accent` (Purple `#9333ea`).
  - True-dark spaces using Deep Gray/OLED-friendly `#09090b` for main backgrounds.
- **Glassmorphism**: Soft background blurs and transparent, thin borders (`border-border/50`, `bg-primary/20`) construct floating navigation layers and cards to deliver depth.
- **Micro-Interactions**: Driven via [Framer Motion](https://www.framer.com/motion/). List items, transitions, page entries, and hover states exhibit soft springing bounces rather than abrupt snapping frames.
- **Typography & Iconography**: Features clean and thick typographic headers balancing with lightweight content paragraphs. [Lucide React](https://lucide.dev/) creates soft, consistent stroke vector icons.

---

## 🧩 Component Library (shadcn/ui)
We bypass heavily-loaded UI templates in favor of **shadcn/ui**, a collection of highly reusable and unstyled components built on top of `Radix UI` accessibility primitives:

- **Atoms**: `Button`, `Badge`, `Input`, `Label`, `Separator`, `Skeleton`.
- **Containers**: `Card` (and its subcomponents `CardContent`, `CardHeader`) and `ScrollArea` (to hijack ugly native scrollbars and replace them with thin, premium overlay bars).

All components live in `src/components/ui/` and are fully editable and tailored perfectly back to our `globals.css` aesthetic tokens.

---

## 📂 Frontend Routing & Layouts

### 1. `(public)` Group
- **Purpose**: Everything accessible without creating an inbox (Landing page).
- **Core File**: `src/app/(public)/layout.tsx` + `page.tsx`
- **Design Elements**: Uses large Hero Sections, Call-To-Action buttons, and a smooth `Navbar`. The layout ensures spacing flows appropriately under transparent navbars.

### 2. `dashboard` Group
- **Purpose**: The core application experience where email addresses are generated.
- **Core File**: `src/app/dashboard/layout.tsx`
- **Design Elements**: 
  - On Desktop mode: A fixed, cleanly separated left sidebar.
  - On Mobile mode: A fixed native bottom-navigation bar with floating icons.
- **Routes**:
  - `/dashboard`: Represents the active **Inbox**. Handles real-time polling logic, copying to the clipboard, and expanding received messages via `useTempMail`.
  - `/dashboard/history`: Represents **Local History**. Driven by `useHistory`, it caches raw data via `localStorage` allowing the user to read old verification codes even when disconnected.
  - `/dashboard/profile`: The **Temporary Profile** management zone for deleting active session inboxes safely.

---

## 📱 Mobile Hybrid (Capacitor) Context
Because this web app executes functionally as a mobile app, it implements several critical layout tweaks:

1. **Safe-Area Insets**: Device notches and modern pill-cameras occlude screens. We capture Apple/Android offsets using CSS environments (`var(--safe-area-top)`) and apply them strictly to Navbars and Layout wrappers.
2. **Scroll Lockdowns**: Traditional web rubber-banding (where sliding past the top of the webpage pulls down empty white space) is intentionally broken via CSS `overscroll-behavior: none` and `touch-action: none` rules across all app pages.
3. **Internal Trapping**: Actions such as "Try Again" on the graceful `offline.html` failover page navigate precisely backwards to the absolute internal `server.url` scheme so that Android system intents do not unexpectedly jettison users into Chrome or Safari browsers.
