"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-coral)] text-white shadow-[var(--shadow-warm-sm)] hover:brightness-110 hover:shadow-[var(--shadow-warm-md)] focus-visible:ring-[var(--color-coral)]",
        secondary:
          "bg-[var(--color-ink)] text-white hover:bg-[var(--color-ink-light)] focus-visible:ring-[var(--color-ink)]",
        outline:
          "border-2 border-[var(--color-coral)] text-[var(--color-coral)] bg-transparent hover:bg-[var(--color-coral)] hover:text-white",
        ghost:
          "text-[var(--color-ink)] hover:bg-[var(--color-muted)]",
        teal:
          "bg-[var(--color-teal)] text-white hover:brightness-110 shadow-[var(--shadow-warm-sm)]",
      },
      size: {
        sm:  "h-8  px-3 text-xs",
        md:  "h-10 px-4 text-sm",
        lg:  "h-12 px-6 text-base",
        xl:  "h-14 px-8 text-lg",
        icon:"h-9  w-9  p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
