import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

const fontHeadline = Bricolage_Grotesque({
  variable: "--font-headline",
  subsets: ["latin"],
  display: "swap",
});

const fontBody = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kartik Verma — AI, Cybersecurity & Creative Development",
  description:
    "Explore Kartik Verma's projects in artificial intelligence, cybersecurity, creative web development, robotics, and embedded systems.",
  authors: [{ name: "Kartik Verma", url: "https://github.com/kartikverma-dev" }],
  creator: "Kartik Verma",
  keywords: [
    "Kartik Verma",
    "AI",
    "Cybersecurity",
    "Creative Development",
    "Computer Vision",
    "Robotics",
    "BCA IMS Ghaziabad",
  ],
  openGraph: {
    title: "Kartik Verma — AI, Cybersecurity & Creative Development",
    description:
      "Explore Kartik Verma's projects in artificial intelligence, cybersecurity, creative web development, robotics, and embedded systems.",
    type: "website",
    locale: "en_US",
    siteName: "Kartik Verma Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kartik Verma — AI, Cybersecurity & Creative Development",
    description:
      "Explore Kartik Verma's projects in artificial intelligence, cybersecurity, creative web development, robotics, and embedded systems.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontHeadline.variable} ${fontBody.variable} ${fontMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body bg-[var(--bg-main)] text-[var(--text-main)] selection:bg-[#2F6BFF] selection:text-white">
        <ThemeProvider>
          <LoadingScreen />
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
