"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-accent text-black font-bold hover:bg-accent-hover hover:shadow-[0_0_10px_rgba(0,208,132,0.25)] active:scale-[0.98]",
  secondary:
    "bg-transparent text-text-secondary border border-border-default hover:text-text-primary hover:border-text-tertiary",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`px-3.5 py-1.5 rounded-[5px] text-sm font-medium cursor-pointer transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
