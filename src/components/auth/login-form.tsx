"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authErr } = await supabase.auth.signInWithPassword({ email, password });

    if (authErr) {
      setError(authErr.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<Mail className="h-4 w-4" />}
        required
      />

      <Input
        label="Password"
        type="password"
        placeholder="Your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<Lock className="h-4 w-4" />}
        required
      />

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <ShimmerButton
        type="submit"
        disabled={loading}
        className="mt-1 w-full"
      >
        {loading ? "Signing in…" : "Sign in ☀️"}
      </ShimmerButton>

      <div className="flex items-center justify-between text-sm">
        <p className="text-[var(--color-ink)] opacity-60">
          No account?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-[var(--color-coral)] hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </form>
  );
}
