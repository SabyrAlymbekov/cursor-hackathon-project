"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const EMOJI_OPTIONS = ["🦁", "🐻", "🦊", "🐧", "🦋", "🐬", "🦄", "🐙", "🦜", "🐸", "🌻", "🍉"];

export function RegisterForm() {
  const router = useRouter();
  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [avatar, setAvatar]         = useState(EMOJI_OPTIONS[0]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [success, setSuccess]       = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Create Supabase Auth user
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
          data: { name, avatar },
        },
      });

      if (authErr) throw authErr;

      // 2. Insert into public.users (after Auth user is created)
      if (authData.user) {
        const { error: dbErr } = await supabase.from("users").insert({
          id: authData.user.id,
          name,
          avatar,
          email,
        });
        if (dbErr && dbErr.code !== "23505") throw dbErr; // ignore duplicate
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-teal)]/15 text-3xl">
          {avatar}
        </div>
        <h2
          className="text-xl font-bold text-[var(--color-ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Check your email, {name}!
        </h2>
        <p className="text-sm text-[var(--color-ink)] opacity-60">
          We sent a confirmation link to <strong>{email}</strong>.
          Click it to activate your account and start playing.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-2 text-sm font-medium text-[var(--color-coral)] underline-offset-2 hover:underline"
        >
          ← Back to home
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Avatar picker */}
      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
          Pick your avatar
        </label>
        <div className="flex flex-wrap gap-2">
          {EMOJI_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setAvatar(emoji)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 text-xl transition-all ${
                avatar === emoji
                  ? "border-[var(--color-coral)] bg-[var(--color-coral)]/10 scale-110"
                  : "border-[var(--color-border)] hover:border-[var(--color-coral)]/50"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <Input
        label="Display name"
        type="text"
        placeholder="e.g. Sabyr"
        value={name}
        onChange={(e) => setName(e.target.value)}
        icon={<User className="h-4 w-4" />}
        required
        minLength={2}
        maxLength={40}
      />

      {/* Email */}
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<Mail className="h-4 w-4" />}
        required
      />

      {/* Password */}
      <Input
        label="Password"
        type="password"
        placeholder="At least 8 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<Lock className="h-4 w-4" />}
        required
        minLength={8}
      />

      {/* Error */}
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        disabled={loading}
        className="mt-1 w-full"
      >
        {loading ? "Creating account…" : `Join as ${avatar} ${name || "…"}`}
      </Button>

      {/* Login link */}
      <p className="text-center text-sm text-[var(--color-ink)] opacity-60">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-[var(--color-coral)] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
