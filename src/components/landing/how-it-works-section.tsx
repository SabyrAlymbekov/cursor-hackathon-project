"use client";

import { motion } from "framer-motion";

const steps = [
  {
    emoji: "🔗",
    title: "Get the link",
    desc: "A friend drops a bingo link in the group chat. Tap it — no app download needed.",
  },
  {
    emoji: "✍️",
    title: "Register in 2 seconds",
    desc: "Enter your name and pick an emoji avatar. That's it. You're in.",
  },
  {
    emoji: "🎯",
    title: "Tap a square",
    desc: "See what others are doing for that challenge. Find people. Make plans. Go do it.",
  },
  {
    emoji: "🎉",
    title: "Hit a line → BINGO!",
    desc: "Complete a row, column, or diagonal. Confetti fires. Share to your Instagram story.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative bg-[var(--color-ink)] py-24 px-4">
      {/* Decorative top wave */}
      <div className="absolute -top-1 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" className="w-full fill-[var(--color-cream)]">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="mx-auto max-w-5xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2
            className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            How it works
          </h2>
          <p className="mt-3 text-white/50">Four steps to your best summer yet.</p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-[var(--color-coral)]/50 hover:bg-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-coral)]/20 text-2xl">
                {step.emoji}
              </div>
              <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-amber)]">
                Step {i + 1}
              </p>
              <h3
                className="mb-2 text-lg font-bold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/60">{step.desc}</p>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[var(--color-coral)] to-[var(--color-amber)] transition-all duration-300 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
