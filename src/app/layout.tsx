import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import { ToastProvider } from "@/components/Toast";
import { CurrencyProvider } from "@/context/CurrencyContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Calcbz - US Finance Calculator Suite",
  description: "Free online calculators for US Mortgages, Loans, Interest, and Taxes.",
  metadataBase: new URL('https://calcbz.com'), // Replace with actual domain when deployed, effectively needed for relative OG images
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col`}
      >
        <ToastProvider>
          <CurrencyProvider>
            <NavBar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <CookieConsent />
          </CurrencyProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
