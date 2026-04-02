"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = "", id, ...props }, ref) => {
    return (
      <div className="mb-2">
        {label && (
          <label
            htmlFor={id}
            className="block text-[13px] text-on-surface-variant mb-1 font-medium"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full h-[40px] px-3.5 border-0 border-b-2 border-outline-variant/40 rounded-none bg-transparent text-on-surface font-sans text-[14px] transition-all duration-150 placeholder:text-on-surface-muted focus:outline-none focus:border-primary read-only:text-status-calc read-only:cursor-default read-only:font-mono ${className}`}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";
