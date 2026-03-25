"use client";

import { forwardRef, InputHTMLAttributes } from "react";

interface DateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ label, value, onChange, className = "", ...props }, ref) => {
    return (
      <div className="mb-2">
        {label && (
          <label className="block text-[10.5px] text-text-tertiary mb-0.5 font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-[29px] px-2 border border-border-subtle rounded-[5px] bg-bg-2 text-text-primary font-sans text-xs transition-[border,box-shadow] duration-150 focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,208,132,0.1)] ${className}`}
          {...props}
        />
      </div>
    );
  }
);
DateInput.displayName = "DateInput";
