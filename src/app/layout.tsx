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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
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
