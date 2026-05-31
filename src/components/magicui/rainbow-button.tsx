"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface RainbowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export function RainbowButton({ children, className, ...props }: RainbowButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl px-8 font-semibold text-white transition-all duration-300",
        // Rainbow border via conic-gradient pseudo
        "before:absolute before:inset-[-2px] before:rounded-[14px] before:bg-[conic-gradient(from_var(--angle),#FF6B5B,#FFB347,#2EC4B6,#FFDAB9,#FF6B5B)] before:animate-[spin_3s_linear_infinite] before:[--angle:0deg] before:content-['']",
        // Inner fill
        "after:absolute after:inset-0 after:rounded-xl after:bg-[var(--color-ink)] after:content-['']",
        // Text above pseudo layers
        "[&>*]:relative [&>*]:z-10 [&]:z-0",
        "hover:scale-[1.02] hover:shadow-[var(--shadow-warm-lg)] active:scale-[0.98]",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
