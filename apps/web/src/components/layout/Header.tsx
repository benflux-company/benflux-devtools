'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@benflux-ui/react';
import { ThemeToggle } from './ThemeToggle';
import { LogIn, LogOut, User, ChevronDown } from 'lucide-react';

const AUTH_PUBLIC_URL =
  process.env.NEXT_PUBLIC_AUTH_PUBLIC_URL ?? 'https://auth.benfluxgroup.com';

interface AuthUser {
  fullName: string;
  email?: string;
}

const BenfluxLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

export function Header() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setUser(data?.user ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const loginUrl = `${AUTH_PUBLIC_URL}/login?rd=${encodeURIComponent(
    typeof window !== 'undefined' ? window.location.href : '/'
  )}`;

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">

        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity"
        >
          <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <BenfluxLogo />
          </span>
          <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight">
            Benflux<br />
            <span className="text-xs font-normal text-gray-500 dark:text-gray-400">DevTools</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1 flex-1 justify-center">
          <Button asChild variant="ghost" size="sm" animate={false}>
            <Link href="/tools/json-formatter">JSON Formatter</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" animate={false}>
            <Link href="/tools/json-to-types">JSON → Types</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" animate={false}>
            <Link href="/tools/json-yaml">JSON ⇄ YAML</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" animate={false}>
            <Link href="/converters" className="flex items-center gap-1">
              Tous les convertisseurs <ChevronDown className="w-3 h-3" />
            </Link>
          </Button>
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-2 shrink-0">
          {!loading && (
            user ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                  <User className="w-4 h-4 text-blue-500" />
                  {user.fullName.split(' ')[0]}
                </span>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  animate={false}
                  className="text-gray-500 hover:text-red-500"
                >
                  <a href={`${AUTH_PUBLIC_URL}/auth/logout`} title="Se déconnecter">
                    <LogOut className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            ) : (
              <Button asChild size="sm">
                <a href={loginUrl} className="flex items-center gap-1.5">
                  <LogIn className="w-4 h-4" />
                  Connexion
                </a>
              </Button>
            )
          )}
          <span className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
          <ThemeToggle />
        </div>

      </div>
    </header>
  );
}
