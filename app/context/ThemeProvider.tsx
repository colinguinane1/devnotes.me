"use client";
const { NextUIProvider } = require("@nextui-org/react");
const { ThemeProvider: NextThemesProvider } = require("next-themes");

function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        {children}
      </NextThemesProvider>
    </NextUIProvider>
  );
}

module.exports = Providers;
