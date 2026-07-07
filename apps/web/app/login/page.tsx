import type { Metadata } from "next";
import { LogIn } from "lucide-react";
import { Button, Card, CardContent, CardDescription, CardHeader } from "@benflux-ui/react";

export const metadata: Metadata = {
  title: "Login – Benflux DevTools",
  description: "Sign in to Benflux DevTools with your Benflux account",
};

const AUTH_PUBLIC_URL = process.env.NEXT_PUBLIC_AUTH_PUBLIC_URL ?? "https://auth.benfluxgroup.com";

export default function LoginPage() {
  return (
    <main
      data-testid="login-page"
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center text-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
            B
          </div>
          <h1 data-testid="login-heading" className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Benflux DevTools
          </h1>
          <CardDescription>Community-driven developer tools</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Button asChild size="lg" className="w-full">
            <a href={`${AUTH_PUBLIC_URL}/login`} data-testid="auth-login-btn">
              <LogIn className="w-5 h-5" />
              Sign in with Benflux
            </a>
          </Button>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            By signing in you agree to our terms of service and privacy policy.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
