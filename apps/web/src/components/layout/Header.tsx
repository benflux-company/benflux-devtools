import Link from "next/link";
import { Button } from "@benflux-ui/react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            B
          </span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">Benflux DevTools</span>
        </Link>

        <nav className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm" animate={false}>
            <Link href="/tools/json-formatter">JSON Formatter</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" animate={false}>
            <a href="/login">Sign in</a>
          </Button>
          <span className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
