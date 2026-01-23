"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import { ProgressProvider } from "@bprogress/next/app";
import QueryProvider from "@/components/providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadata: Metadata = {
  title: "إرتقاء - لوحة التحكم",
  description:
    "لوحة تحكم إرتقاء - إدارة البرامج والمتدربين والشهادات والتحليلات",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <QueryProvider>
            <ProgressProvider
              height="4px"
              options={{ showSpinner: false }}
              shallowRouting
            >
              {children}
            </ProgressProvider>
          </QueryProvider>
          <Toaster
            position="top-right"
            richColors
            duration={7000}
            closeButton
          />
        </AuthProvider>
      </body>
    </html>
  );
}
