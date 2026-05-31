"use client";

import Link from "next/link";
import { ArrowRight, Link2 } from "lucide-react";
import { motion } from "framer-motion";
import { Particles } from "@/components/magicui/particles";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0 },
};

export function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
      {/* Warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-peach)] via-[var(--color-cream)] to-[var(--color-cream)]" />

      {/* Decorative blobs */}
      <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-[var(--color-coral)] opacity-10 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-[500px] w-[500px] rounded-full bg-[var(--color-amber)] opacity-10 blur-3xl" />
      <div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[var(--color-teal)] opacity-5 blur-3xl" />

      {/* Particles */}
      <Particles className="absolute inset-0" quantity={55} />

      {/* Content */}
      <motion.div
        className="relative z-10 flex max-w-4xl flex-col items-center gap-6"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.12 } } }}
      >
        {/* Badge */}
        <motion.div variants={fadeUp}>
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-amber)] bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-ink)] shadow-[var(--shadow-warm-sm)] backdrop-blur-sm">
            ☀️ Summer 2025 &nbsp;·&nbsp; Play with friends
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[0.95] tracking-tight text-[var(--color-ink)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          let it{" "}
          <AnimatedGradientText className="text-[clamp(3rem,8vw,6rem)] font-bold leading-[0.95]">
            bingo
          </AnimatedGradientText>
          <br />
          <span className="text-[clamp(2rem,5vw,3.5rem)] font-medium text-[var(--color-ink)] opacity-60">
            this summer.
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          variants={fadeUp}
          className="max-w-xl text-[clamp(1rem,2.5vw,1.25rem)] text-[var(--color-ink)] opacity-70 leading-relaxed"
        >
          Turn your bucket list into a shared game. Drop a link in the group chat,
          mark what you&apos;ve done, find people to join you — hit a line and celebrate.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="mt-2 flex flex-col items-center gap-4 sm:flex-row"
        >
          <ShimmerButton className="h-14 px-8 text-base">
            <Link href="/create" className="flex items-center gap-2">
              Start a bingo <ArrowRight className="h-4 w-4" />
            </Link>
          </ShimmerButton>

          <Link
            href="/auth/login"
            className="group flex items-center gap-2 rounded-xl border-2 border-[var(--color-ink)] px-8 py-3.5 text-base font-semibold text-[var(--color-ink)] transition-all hover:bg-[var(--color-ink)] hover:text-white"
          >
            <Link2 className="h-4 w-4" />
            I have a link
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.p variants={fadeUp} className="text-sm text-[var(--color-ink)] opacity-40">
          No app needed · Free forever
        </motion.p>
      </motion.div>

      {/* Floating bingo preview card */}
      <motion.div
        className="absolute bottom-8 right-8 hidden xl:block"
        initial={{ opacity: 0, rotate: 6, scale: 0.9 }}
        animate={{ opacity: 1, rotate: 3, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
      >
        <MiniBindoPreview />
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        <div className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-[var(--color-ink)] border-opacity-30 p-1">
          <div className="h-1.5 w-1 rounded-full bg-[var(--color-ink)] opacity-40" />
        </div>
      </motion.div>
    </section>
  );
}

function MiniBindoPreview() {
  const cells = [
    "Swim at sunrise", "Try street food", "FREE ☀️", "Watch a meteor shower", "Learn to surf",
    "Camp overnight", "Go on a hike", "Read on the beach", "Cook a BBQ", "Rent a bike",
  ];

  return (
    <div
      className="w-48 overflow-hidden rounded-2xl border-2 border-[var(--color-border)] bg-white/90 p-2 shadow-[var(--shadow-warm-lg)] backdrop-blur-sm"
      style={{ fontFamily: "var(--font-display)" }}
    >
      <div className="mb-2 rounded-lg bg-[var(--color-coral)] px-2 py-1 text-center text-[10px] font-bold text-white">
        Adventure Summer ☀️
      </div>
      <div className="grid grid-cols-2 gap-1">
        {cells.slice(0, 8).map((c, i) => (
          <div
            key={i}
            className={`rounded-md px-1 py-1.5 text-center text-[8px] font-medium leading-tight ${
              c === "FREE ☀️" || i === 1 || i === 5
                ? "bg-[var(--color-teal)] text-white"
                : "bg-[var(--color-muted)] text-[var(--color-ink)]"
            }`}
          >
            {c}
          </div>
        ))}
      </div>
    </div>
  );
}
