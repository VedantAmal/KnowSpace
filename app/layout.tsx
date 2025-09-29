import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "KnowSpace - Modular Knowledge Workspace",
  description: "A unified platform for structured documentation and collaborative discussions",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased dark`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
