"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    emoji: "🔗",
    title: "Get the link",
    desc: "A friend drops a bingo link in the group chat. Tap it — no app download needed.",
  },
  {
    num: "02",
    emoji: "✍️",
    title: "Register in 2 s",
    desc: "Enter your name, pick an emoji, done. You're on the board.",
  },
  {
    num: "03",
    emoji: "🎯",
    title: "Tap a square",
    desc: "See who else is doing that challenge. Find people. Make plans. Go.",
  },
  {
    num: "04",
    emoji: "🎉",
    title: "Hit BINGO!",
    desc: "Complete a row, column, or diagonal. Confetti fires. Share your win.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative bg-foreground px-6 py-24">
      {/* Wave from hero */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 48" className="w-full" style={{ fill: "hsl(var(--background))" }}>
          <path d="M0,32 C480,56 960,8 1440,32 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="mx-auto max-w-5xl pt-8">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2
            className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-primary-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Four steps.
            <br />
            <span style={{ color: "hsl(var(--secondary))" }}>Best summer yet.</span>
          </h2>
        </motion.div>

        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 rounded-2xl overflow-hidden border-2 border-border/20">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="flex flex-col gap-4 bg-card/5 p-7 transition-colors hover:bg-card/10"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              {/* Number stamp */}
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary text-sm font-bold text-primary-foreground"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step.num}
                </span>
                <span className="text-2xl">{step.emoji}</span>
              </div>

              <div>
                <h3
                  className="mb-1.5 text-lg font-bold text-card"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground) / 0.8)" }}>
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom wave into templates */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 48" className="w-full" style={{ fill: "hsl(var(--background))" }}>
          <path d="M0,16 C480,-8 960,40 1440,16 L1440,48 L0,48 Z" />
        </svg>
      </div>
    </section>
  );
}
