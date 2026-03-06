import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ResumeRecordingGuard } from "@/components/shared/ResumeRecordingGuard";
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
  title: "Nailed It — AI Pitch Coach",
  description:
    "Record your elevator pitch and get instant AI feedback on delivery, body language, story structure, and confidence.",
  openGraph: {
    title: "Nailed It — AI Pitch Coach",
    description:
      "Record your elevator pitch and get instant AI feedback on delivery, body language, story structure, and confidence.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body
        className="antialiased min-h-screen bg-background font-sans"
      >
        <Suspense>
          <ResumeRecordingGuard />
        </Suspense>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
