"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { TEMPLATES } from "@/lib/templates";

export function TemplatesSection() {
  return (
    <section className="py-24 px-4 bg-[var(--color-cream)]">
      <div className="mx-auto max-w-5xl">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2
            className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-[var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Pick a template,
            <br />
            <span className="text-gradient-coral">start in one tap.</span>
          </h2>
          <p className="mt-3 text-[var(--color-ink)] opacity-60">
            Every cell is editable. Make it yours.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-3">
          {TEMPLATES.map((t, i) => (
            <motion.div
              key={t.id}
              className="group relative overflow-hidden rounded-2xl border-2 border-[var(--color-border)] bg-white transition-all hover:border-[var(--color-coral)] hover:shadow-[var(--shadow-warm-md)]"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              {/* Colored header band */}
              <div
                className="flex items-center gap-3 px-6 py-4"
                style={{ background: t.color + "22", borderBottom: `2px solid ${t.color}33` }}
              >
                <span className="text-3xl">{t.emoji}</span>
                <div>
                  <h3
                    className="font-bold text-[var(--color-ink)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {t.name}
                  </h3>
                  <p className="text-xs text-[var(--color-ink)] opacity-50">{t.description}</p>
                </div>
              </div>

              {/* Mini challenge preview */}
              <div className="px-6 py-4">
                <div className="flex flex-wrap gap-1.5">
                  {t.challenges.slice(0, 6).map((c, j) => (
                    <span
                      key={j}
                      className="rounded-lg bg-[var(--color-muted)] px-2 py-1 text-[10px] font-medium text-[var(--color-ink)]"
                    >
                      {c}
                    </span>
                  ))}
                  <span className="rounded-lg bg-[var(--color-muted)] px-2 py-1 text-[10px] text-[var(--color-ink)] opacity-50">
                    +18 more
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="px-6 pb-5">
                <Link
                  href={`/create?template=${t.id}`}
                  className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-all"
                  style={{ background: t.color }}
                >
                  Use this template
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Or write your own */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link
            href="/create"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-ink)] underline-offset-4 hover:underline opacity-60 hover:opacity-100 transition-opacity"
          >
            Or write your own 24 challenges from scratch →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
