'use client'
import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Navigation } from "@/components/navigation"
import { TonConnectUIProvider } from "@tonconnect/ui-react"
import "./globals.css"
import { Suspense } from "react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const metadata: Metadata = {
  title: "CertifyNFT - TON Blockchain Certification Platform",
  description: "Professional NFT certification platform on TON blockchain",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <TonConnectUIProvider manifestUrl="https://peach-fast-clam-38.mypinata.cloud/ipfs/bafkreidsqkapogy6yric4zskh76r5ldsdrstwrlnvsidb2fzi2tflqzywa">
          <div className="flex min-h-screen">
            <Navigation />
            <main className="flex-1 md:ml-64 p-6">
              <Suspense>{children}</Suspense>
            </main>
          </div>
        </TonConnectUIProvider>
        <Analytics />
      </body>
    </html>
  )
}
