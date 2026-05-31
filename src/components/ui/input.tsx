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
          <label htmlFor={inputId} className="text-sm font-semibold text-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </span>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            className={cn(
              "flex w-full rounded-[var(--radius-md)] border-2 border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground",
              "transition-colors duration-150",
              "focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive focus:border-destructive focus:ring-destructive",
              icon && "pl-10",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
