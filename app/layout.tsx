import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Header from "../components/global/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import { ViewTransitions } from "next-view-transitions";
import { DM_Sans } from "next/font/google";

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
    <html suppressHydrationWarning className={dm_sans.className} lang="en">
      <body className="antialiased  bg-primary-light dark:bg-primary-dark transition-colors">
        {" "}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ClerkProvider>
            <Header />
            <div className="mt-[4.5rem]">{children}</div>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
