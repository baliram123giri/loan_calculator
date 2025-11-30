import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import { ToastProvider } from "@/components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Loanly - US Finance Calculator Suite",
  description: "Free online calculators for US Mortgages, Loans, Interest, and Taxes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col`}
      >
        <ToastProvider>
          <NavBar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CookieConsent />
        </ToastProvider>
      </body>
    </html>
  );
}
