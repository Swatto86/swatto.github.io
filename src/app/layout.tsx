import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { MainNav } from "@/components/main-nav";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/error-boundary";

import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Swatto's Useful Utilities",
  description: "Enhancing your productivity with custom-built tools",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#EF4444",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("min-h-screen font-sans antialiased", inter.variable)}
      >
        <ErrorBoundary>
          <ThemeProvider
            attribute="data-theme"
            defaultTheme="colourful"
            enableSystem={false}
            storageKey="swatto-theme"
            themes={["light", "dark", "colourful"]}
          >
            <div className="flex min-h-screen">
              <MainNav />
              <main className="flex-1 lg:pl-64 lg:pr-64">
                <div className="mx-auto px-2 sm:px-4 lg:px-4 py-4 lg:py-8">
                  {children}
                </div>
              </main>
            </div>
            <Toaster />
          </ThemeProvider>
        </ErrorBoundary>
        <Analytics debug={false} />
        <SpeedInsights />
      </body>
    </html>
  );
}
