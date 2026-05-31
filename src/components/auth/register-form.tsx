"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const EMOJI_OPTIONS = ["🦁", "🐻", "🦊", "🐧", "🦋", "🐬", "🦄", "🐙", "🦜", "🐸", "🌻", "🍉"];

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/create";

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar]     = useState(EMOJI_OPTIONS[0]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=${encodeURIComponent(next)}`,
          data: { name, avatar },
        },
      });

      if (authErr) throw authErr;

      if (authData.user) {
        const { error: dbErr } = await supabase.from("users").insert({
          id: authData.user.id,
          name,
          avatar,
          email,
        });
        if (dbErr && dbErr.code !== "23505") throw dbErr;

        // If Supabase auto-confirms (no email confirmation required), redirect immediately
        if (authData.session) {
          router.push(next);
          return;
        }
      }

      // Email confirmation required — show message
      router.push(`/auth/confirm?email=${encodeURIComponent(email)}&avatar=${encodeURIComponent(avatar)}&name=${encodeURIComponent(name)}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Avatar picker */}
      <div>
        <label className="mb-2 block text-sm font-medium text-(--color-ink)">
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
                  ? "border-(--color-coral) bg-(--color-coral)/10 scale-110"
                  : "border-border hover:border-(--color-coral)/50"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

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
        placeholder="At least 8 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<Lock className="h-4 w-4" />}
        required
        minLength={8}
      />

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={loading} className="mt-1 w-full">
        {loading ? "Creating account…" : `Join as ${avatar} ${name || "…"}`}
      </Button>

      <p className="text-center text-sm text-(--color-ink) opacity-60">
        Already have an account?{" "}
        <Link
          href={`/auth/login?next=${encodeURIComponent(next)}`}
          className="font-medium text-(--color-coral) hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
