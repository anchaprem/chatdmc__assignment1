import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stripe Subscription App",
  description: "Subscription management system with Stripe integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold">
                SubscriptionApp
              </Link>
              <div className="flex items-center gap-4">
                <Link 
                  href="/pricing" 
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Pricing
                </Link>
                <Link 
                  href="/dashboard" 
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
