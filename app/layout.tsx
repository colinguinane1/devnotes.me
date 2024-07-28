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

const inter = Inter({ subsets: ["latin"] });
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
    <html className={geist.className} lang="en">
      <body className="antialiased bg-primary-light dark:bg-primary-dark transition-colors">
        {" "}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ClerkProvider>
            <Header />
            <div className="mt-[4.1rem]">{children}</div>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
