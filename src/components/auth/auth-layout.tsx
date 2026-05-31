import Link from "next/link";
import { Particles } from "@/components/magicui/particles";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[var(--color-cream)] px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-peach)] via-[var(--color-cream)] to-[var(--color-cream)]" />
      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-[var(--color-coral)] opacity-10 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[var(--color-amber)] opacity-10 blur-3xl" />
      <Particles className="absolute inset-0" quantity={30} />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand link */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-3xl font-bold text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            letit<span className="text-[var(--color-coral)]">bingo</span>
          </Link>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl border-2 border-[var(--color-border)] bg-white/90 shadow-[var(--shadow-warm-lg)] backdrop-blur-sm">
          {/* Card header band */}
          <div className="bg-gradient-to-r from-[var(--color-coral)] to-[var(--color-amber)] px-8 py-6">
            <h1
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {title}
            </h1>
            <p className="mt-1 text-sm text-white/80">{subtitle}</p>
          </div>

          {/* Form area */}
          <div className="px-8 py-7">{children}</div>
        </div>

        {/* Back to home */}
        <p className="mt-6 text-center text-sm text-[var(--color-ink)] opacity-50">
          <Link href="/" className="underline-offset-2 hover:underline hover:opacity-100 transition-opacity">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
