"use client";

import React, { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={clsx(
            "flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600",
            "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
            error ? "border-red-400 focus:border-red-500 focus:ring-red-400/20" : "border-slate-200",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        {!error && helperText && <p className="text-xs text-slate-400">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
