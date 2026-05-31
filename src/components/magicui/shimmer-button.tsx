"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  shimmerColor?: string;
}

export function ShimmerButton({
  children,
  className,
  shimmerColor: _shimmerColor = "#FFB347",
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex h-12 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-[var(--color-coral)] bg-[var(--color-coral)] px-8 font-semibold text-white",
        "transition-all duration-300 hover:brightness-110 hover:shadow-[var(--shadow-warm-md)] active:scale-[0.98]",
        className
      )}
      {...props}
    >
      {/* Shimmer sweep */}
      <span
        className="absolute inset-0 -translate-x-full animate-[shimmer-slide_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
