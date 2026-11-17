import React, { HTMLAttributes } from "react";
import clsx from "clsx";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "emergency" | "warning" | "safe" | "info" | "slate";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    primary: "bg-teal-50 text-teal-700 border-teal-200",
    emergency: "bg-red-50 text-red-600 border-red-200 font-medium",
    warning: "bg-amber-50 text-amber-700 border-amber-200 font-medium",
    safe: "bg-emerald-50 text-emerald-700 border-emerald-200",
    info: "bg-sky-50 text-sky-700 border-sky-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const sizeStyles = {
    sm: "text-xs px-2 py-0.5 rounded",
    md: "text-xs px-2.5 py-1 rounded-md",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 border font-medium transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
