import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
