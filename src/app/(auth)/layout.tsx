"use client"

import { Navbar } from "@/components/navbar"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen flex items-center justify-center">
        {children}
      </main>
    </>
  )
}
