import Link from "next/link";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Warm top stripe */}
      <div className="h-2 w-full bg-primary" />

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        {/* Brand */}
        <Link
          href="/"
          className="mb-8 text-3xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          letit<span className="text-primary">bingo</span>
        </Link>

        {/* Card */}
        <div className="w-full max-w-md overflow-hidden rounded-2xl border-2 border-border bg-card shadow-lg">
          {/* Header band */}
          <div className="bg-primary px-8 py-6">
            <h1
              className="text-2xl font-bold text-primary-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {title}
            </h1>
            <p className="mt-1 text-sm text-primary-foreground/75">{subtitle}</p>
          </div>

          {/* Form */}
          <div className="px-8 py-7">{children}</div>
        </div>

        {/* Back link */}
        <Link
          href="/"
          className="mt-6 text-sm text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
