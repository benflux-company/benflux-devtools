import type { Metadata } from "next";
import { BenfluxProvider } from "@benflux-ui/react";
import "@benflux-ui/react/styles";
import "./globals.css";
import { Header } from "@/src/components/layout/Header";

export const metadata: Metadata = {
  title: "Benflux DevTools",
  description: "Community-driven developer tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <BenfluxProvider defaultTheme="system" storageKey="benflux-theme">
          <Header />
          <main>{children}</main>
        </BenfluxProvider>
      </body>
    </html>
  );
}
