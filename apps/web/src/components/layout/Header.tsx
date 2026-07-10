'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@benflux-ui/react';
import { ThemeToggle } from './ThemeToggle';
import { LogIn, LogOut, User, ChevronDown, Menu, X } from 'lucide-react';

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

const NAV_LINKS = [
  { href: '/tools/json-formatter', label: 'JSON Formatter' },
  { href: '/tools/json-to-types', label: 'JSON → Types' },
  { href: '/tools/json-yaml', label: 'JSON ⇄ YAML' },
];

export function Header() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const AuthArea = () => (
    <>
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
    </>
  );

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
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

        {/* Nav (desktop) */}
        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV_LINKS.map((link) => (
            <Button key={link.href} asChild variant="ghost" size="sm" animate={false}>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          <Button asChild variant="ghost" size="sm" animate={false}>
            <Link href="/converters" className="flex items-center gap-1">
              Tous les convertisseurs <ChevronDown className="w-3 h-3" />
            </Link>
          </Button>
        </nav>

        {/* Auth + theme (desktop) */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <AuthArea />
          <span className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-1 shrink-0">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            animate={false}
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 px-4 py-3 flex flex-col gap-1 bg-white dark:bg-gray-900">
          {NAV_LINKS.map((link) => (
            <Button
              key={link.href}
              asChild
              variant="ghost"
              size="sm"
              animate={false}
              className="justify-start"
              onClick={() => setMobileOpen(false)}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          <Button
            asChild
            variant="ghost"
            size="sm"
            animate={false}
            className="justify-start"
            onClick={() => setMobileOpen(false)}
          >
            <Link href="/converters" className="flex items-center gap-1">
              Tous les convertisseurs <ChevronDown className="w-3 h-3" />
            </Link>
          </Button>
          <div className="border-t border-gray-200 dark:border-gray-800 mt-2 pt-3 flex items-center">
            <AuthArea />
          </div>
        </div>
      )}
    </header>
  );
}
