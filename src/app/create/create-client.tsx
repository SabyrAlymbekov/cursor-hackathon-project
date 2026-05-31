"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Pencil } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { TEMPLATES, type BingoTemplate } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Props {
  userId: string;
  defaultTemplate?: string;
}

function buildSquares(challenges: string[]) {
  // 24 challenges → squares with ids 0-11, 13-24 (skipping 12 = FREE)
  return challenges.map((text, i) => ({
    id: i < 12 ? i : i + 1,
    text,
  }));
}

export function CreateBingo({ userId, defaultTemplate }: Props) {
  const router = useRouter();

  const initial = TEMPLATES.find((t) => t.id === defaultTemplate) ?? null;

  const [step, setStep]                 = useState<"pick" | "edit">(initial ? "edit" : "pick");
  const [selected, setSelected]         = useState<BingoTemplate | null>(initial);
  const [title, setTitle]               = useState(initial?.name ?? "");
  const [challenges, setChallenges]     = useState<string[]>(
    initial?.challenges ?? Array(24).fill("")
  );
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  function pickTemplate(t: BingoTemplate) {
    setSelected(t);
    setTitle(t.name);
    setChallenges([...t.challenges]);
    setStep("edit");
  }

  function pickBlank() {
    setSelected(null);
    setTitle("");
    setChallenges(Array(24).fill(""));
    setStep("edit");
  }

  async function handleCreate() {
    if (!title.trim()) { setError("Please add a title."); return; }
    const filled = challenges.filter((c) => c.trim());
    if (filled.length < 5) { setError("Add at least 5 challenges."); return; }

    setError(null);
    setLoading(true);

    const squares = buildSquares(challenges.map((c) => c.trim() || "…"));

    const { data: bingo, error: dbErr } = await supabase
      .from("bingos")
      .insert({ title: title.trim(), squares, created_by: userId })
      .select("id")
      .single();

    setLoading(false);

    if (dbErr) { setError(dbErr.message); return; }
    router.push(`/b/${bingo.id}`);
  }

  if (step === "pick") {
    return (
      <main className="min-h-dvh bg-background px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Link>

          <h1 className="mb-2 text-4xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
            Pick a template
          </h1>
          <p className="mb-8 text-muted-foreground">Choose a starter or build your own from scratch.</p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((t) => (
              <motion.button
                key={t.id}
                onClick={() => pickTemplate(t)}
                className="group flex flex-col gap-3 rounded-2xl border-2 border-border bg-card p-5 text-left transition-all hover:border-primary hover:shadow-md"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{t.emoji}</span>
                  <span className="font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                    {t.name}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{t.description}</p>
                <div className="flex flex-wrap gap-1">
                  {t.challenges.slice(0, 3).map((c, i) => (
                    <span key={i} className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      {c}
                    </span>
                  ))}
                  <span className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                    +21
                  </span>
                </div>
                <div className="mt-auto flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Use this <ArrowRight className="h-3 w-3" />
                </div>
              </motion.button>
            ))}

            {/* Blank card */}
            <motion.button
              onClick={pickBlank}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-card p-5 text-center transition-all hover:border-primary hover:shadow-md"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Pencil className="h-6 w-6 text-muted-foreground" />
              <span className="font-semibold text-foreground">Build from scratch</span>
              <span className="text-xs text-muted-foreground">Write your own 24 challenges</span>
            </motion.button>
          </div>
        </div>
      </main>
    );
  }

  // Edit step
  return (
    <main className="min-h-dvh bg-background px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => setStep("pick")}
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to templates
        </button>

        <h1 className="mb-6 text-4xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
          {selected ? `Editing: ${selected.name} ${selected.emoji}` : "Build your bingo"}
        </h1>

        {/* Title */}
        <div className="mb-6">
          <Input
            label="Bingo title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Adventure Summer 2025"
            maxLength={60}
          />
        </div>

        {/* FREE square notice */}
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-accent/10 px-4 py-3 text-sm text-accent">
          <span className="text-base">☀️</span>
          <span>Center square is always <strong>FREE</strong> — no need to fill it.</span>
        </div>

        {/* Challenge grid — 24 inputs */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 24 }, (_, i) => {
            const pos = i < 12 ? i + 1 : i + 2; // display position on the board (1-25, skipping 13)
            return (
              <div key={i} className="flex flex-col gap-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  #{pos}
                </label>
                <input
                  value={challenges[i]}
                  onChange={(e) => {
                    const next = [...challenges];
                    next[i] = e.target.value;
                    setChallenges(next);
                  }}
                  placeholder={`Challenge ${pos}`}
                  maxLength={50}
                  className={cn(
                    "w-full rounded-lg border-2 border-input bg-background px-3 py-2 text-sm",
                    "placeholder:text-muted-foreground focus:border-primary focus:outline-none",
                    "transition-colors duration-150"
                  )}
                />
              </div>
            );
          })}
        </div>

        {error && (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <Button size="lg" onClick={handleCreate} disabled={loading} className="w-full">
          {loading ? "Creating your bingo…" : "Create bingo & get link ✨"}
        </Button>
      </div>
    </main>
  );
}
