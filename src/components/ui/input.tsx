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
            className="block text-[10.5px] text-text-tertiary mb-0.5 font-medium tracking-[0.01em]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full h-[29px] px-2 border border-border-subtle rounded-[5px] bg-bg-2 text-text-primary font-sans text-xs transition-[border,box-shadow] duration-150 placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)] read-only:bg-status-calc-bg read-only:text-status-calc read-only:cursor-default read-only:font-mono read-only:border-[rgba(34,211,238,0.2)] ${className}`}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";
