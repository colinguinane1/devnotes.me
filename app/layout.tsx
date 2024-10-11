import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Header from "../components/global/Header";

import { ThemeProvider } from "next-themes";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import { ViewTransitions } from "next-view-transitions";
import { DM_Sans } from "next/font/google";
import Footer from "@/components/global/Footer";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import NextTopLoader from "nextjs-toploader";
import "@/app/globals.css";
import NHeader from "@/components/global/new-Header";

const inter = Inter({ subsets: ["latin"] });
const dm_sans = DM_Sans({ subsets: ["latin"] });
const geist = GeistSans;

export const metadata: Metadata = {
  title: "devnotes.me | Home",
  description: "The Blog, for developers, by developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning className="font-sans" lang="en">
      <body className="antialiased  bg-primary-light dark:bg-primary-dark transition-colors">
        {" "}
        <NextTopLoader />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Analytics />
          <NHeader />
          <div className="pt-[3.8rem]">{children} </div>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
