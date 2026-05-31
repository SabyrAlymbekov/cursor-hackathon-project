import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AnimatedGradientTextProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedGradientText({ children, className }: AnimatedGradientTextProps) {
  return (
    <span
      className={cn(
        "inline-block bg-[length:300%_auto] bg-gradient-to-r from-[var(--color-coral)] via-[var(--color-amber)] to-[var(--color-teal)]",
        "animate-[gradient_4s_linear_infinite]",
        "[background-clip:text] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]",
        className
      )}
    >
      {children}
    </span>
  );
}
