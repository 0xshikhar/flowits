import "./globals.css"

import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/app/providers"
import Sidebar from "@/components/navigation/sidebar"
import { WalletConnect } from "@/components/WalletConnect"

const inter = Inter({ subsets: ["latin"] })

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url.base),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.author,
      url: siteConfig.url.author,
    },
  ],
  creator: siteConfig.author,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url.base,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@_rdev7",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn("bg-white min-h-screen", inter.className)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          forcedTheme="light"
        >
          <Providers>
            <div className="flex border border-gray-400 shadow-lg min-h-screen m-3 md:m-6">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="border-b border-gray-400 bg-white p-4 flex justify-end items-center">
                  <WalletConnect />
                </header>
                
                {/* Main Content */}
                <main className="flex-1 overflow-y-auto border-l border-gray-400 bg-gradient-to-b from-[#FFFEE8] to-[#F6FCE5]">
                  {children}
                </main>
              </div>
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
