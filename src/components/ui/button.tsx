"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary font-semibold hover:bg-primary-container active:scale-[0.98]",
  secondary:
    "bg-surface-highest text-on-surface-variant hover:bg-surface-high hover:text-on-surface",
  ghost:
    "bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`px-3.5 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
