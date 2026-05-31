"use client";

import Link from "next/link";
import { ArrowRight, Link2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0 },
};

export function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-background">
      {/* Sun circle — decorative, not glow blob */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[480px] w-[480px] rounded-full"
        style={{ background: "hsl(var(--secondary) / 0.22)" }}
      />
      {/* Small dot pattern strip */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-16 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--primary) / 0.4) 1.5px, transparent 1.5px)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Main content — two-column on large screens */}
      <div className="mx-auto flex min-h-[100dvh] max-w-6xl flex-col items-center justify-center gap-12 px-6 py-20 lg:flex-row lg:items-center lg:gap-16">

        {/* Left: text */}
        <motion.div
          className="flex max-w-xl flex-col gap-6"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        >
          {/* Season badge */}
          <motion.div variants={fadeUp}>
            <Badge variant="summer" className="text-xs">
              ☀️ Summer 2025 &nbsp;·&nbsp; Play with friends
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.div variants={fadeUp} className="flex flex-col gap-1">
            <h1
              className="text-[clamp(2.8rem,7vw,5.5rem)] font-bold leading-[0.92] tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              A bucket list
              <br />
              nobody finishes—
            </h1>
            {/* Brand in a punchy coral block */}
            <div className="mt-3 inline-flex w-fit items-baseline gap-3">
              <span
                className="block rounded-lg bg-primary px-4 py-1 text-[clamp(2.8rem,7vw,5.5rem)] font-bold leading-[1] tracking-tight text-primary-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                letitbingo
              </span>
            </div>
            <p
              className="mt-2 text-[clamp(1.1rem,2.5vw,1.4rem)] font-medium text-muted-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              turned into a game.
            </p>
          </motion.div>

          {/* Sub-copy */}
          <motion.p variants={fadeUp} className="text-base leading-relaxed text-muted-foreground">
            Turn your summer challenges into a shared bingo. Drop a link in the group
            chat, mark what you&apos;ve done, find people to join you — hit a line and
            celebrate.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/create">
                Start a bingo <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">
                <Link2 className="h-4 w-4" /> I have a link
              </Link>
            </Button>
          </motion.div>

          <motion.p variants={fadeUp} className="text-xs text-muted-foreground">
            No app needed &nbsp;·&nbsp; Free forever
          </motion.p>
        </motion.div>

        {/* Right: floating bingo card */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, y: 16, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 2 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
        >
          <MiniBindoPreview />
        </motion.div>
      </div>

      {/* Bottom wave into next section */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 48" className="w-full" style={{ fill: "hsl(var(--foreground))" }}>
          <path d="M0,32 C480,56 960,8 1440,32 L1440,48 L0,48 Z" />
        </svg>
      </div>
    </section>
  );
}

const CELLS = [
  { text: "Swim at sunrise",     done: false },
  { text: "Try street food",     done: true  },
  { text: "Camp overnight",      done: false },
  { text: "Watch meteors",       done: false },
  { text: "Learn to surf",       done: true  },
  { text: "Go on a hike",        done: false },
  { text: "Read on beach",       done: true  },
  { text: "FREE ☀️",             done: true  },
  { text: "Cook a BBQ",          done: false },
  { text: "Rent a bike",         done: true  },
  { text: "Watch the sunset",    done: false },
  { text: "Go kayaking",         done: false },
];

function MiniBindoPreview() {
  return (
    <div
      className="w-64 overflow-hidden rounded-2xl border-2 border-border bg-card shadow-lg"
      style={{ fontFamily: "var(--font-display)" }}
    >
      {/* Stamp header */}
      <div className="bg-primary px-4 py-3 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-foreground opacity-70">
          B · I · N · G · O
        </p>
        <p className="mt-0.5 text-sm font-bold text-primary-foreground">Adventure Summer ☀️</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-1 p-2">
        {CELLS.map((c, i) => (
          <div
            key={i}
            className={`flex items-center justify-center rounded-md px-1 py-2 text-center text-[8px] font-semibold leading-tight ${
              c.done
                ? "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {c.done && c.text !== "FREE ☀️" && (
              <span className="mr-0.5 opacity-70">✓</span>
            )}
            {c.text}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="px-3 pb-3 pt-1">
        <div className="mb-1 flex justify-between text-[9px] font-semibold text-muted-foreground">
          <span>Progress</span>
          <span className="text-accent">5 / 24</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[21%] rounded-full bg-accent" />
        </div>
      </div>
    </div>
  );
}
