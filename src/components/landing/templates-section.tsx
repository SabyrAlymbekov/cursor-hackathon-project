"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { TEMPLATES } from "@/lib/templates";

export function TemplatesSection() {
  return (
    <section className="border-t border-border bg-background px-6 py-24">
      <div className="mx-auto max-w-5xl">

        {/* Section header */}
        <div className="mb-12 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Templates
            </p>
            <h2
              className="text-[clamp(1.8rem,4vw,3rem)] font-bold leading-tight text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Pick a template.
              <br />
              Start in one tap.
            </h2>
          </div>
          <Link
            href="/create"
            className="mt-4 hidden text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline sm:block"
          >
            Build from scratch →
          </Link>
        </div>

        {/* Template rows */}
        <div className="flex flex-col divide-y divide-border">
          {TEMPLATES.map((t, i) => (
            <motion.div
              key={t.id}
              className="group flex flex-col gap-4 py-7 sm:flex-row sm:items-start sm:gap-8"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
            >
              {/* Index number */}
              <span
                className="shrink-0 text-[2.5rem] font-bold leading-none text-border sm:w-12 sm:text-right"
                style={{ fontFamily: "var(--font-display)" }}
              >
                0{i + 1}
              </span>

              {/* Content */}
              <div className="flex flex-1 flex-col gap-3">
                <div className="flex items-center gap-3">
                  <h3
                    className="text-xl font-bold text-foreground"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {t.name}
                  </h3>
                  <span className="text-lg">{t.emoji}</span>
                </div>
                <p className="text-sm text-muted-foreground">{t.description}</p>

                {/* Challenge chips — monochrome */}
                <div className="flex flex-wrap gap-1.5">
                  {t.challenges.slice(0, 6).map((c, j) => (
                    <span
                      key={j}
                      className="rounded border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-foreground"
                    >
                      {c}
                    </span>
                  ))}
                  <span className="rounded border border-border bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
                    +18 more
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="shrink-0 sm:pt-1">
                <Link
                  href={`/create?template=${t.id}`}
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-foreground bg-transparent px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-foreground hover:text-background"
                >
                  Use template
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile "from scratch" link */}
        <div className="mt-8 sm:hidden">
          <Link
            href="/create"
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Or build from scratch →
          </Link>
        </div>
      </div>
    </section>
  );
}
