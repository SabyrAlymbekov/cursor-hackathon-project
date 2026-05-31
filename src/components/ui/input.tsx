import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-ink)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink)] opacity-40">
              {icon}
            </span>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              "w-full rounded-xl border-2 border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink)] placeholder:opacity-40",
              "transition-all duration-150",
              "focus:border-[var(--color-coral)] focus:outline-none focus:ring-2 focus:ring-[var(--color-coral)] focus:ring-offset-1",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-red-400 focus:border-red-400 focus:ring-red-400",
              icon && "pl-10",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
