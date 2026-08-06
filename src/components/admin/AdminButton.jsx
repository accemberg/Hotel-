"use client";
import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminButton({
  children,
  variant = "primary",
  size = "md",
  className,
  loading = false,
  disabled,
  icon: Icon,
  ...props
}) {
  // Uniform styling across standard buttons: h-16, rounded-xl, text-[22px], font-semibold
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none h-16 px-8 text-[22px] gap-2";
  
  const variants = {
    primary: "bg-[#c99a2c] text-slate-900 hover:bg-[#b08826] shadow-sm hover:shadow focus-visible:ring-[#c99a2c]",
    secondary: "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-slate-500 shadow-sm",
    outline: "bg-transparent text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-slate-500",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-slate-500",
    danger: "bg-transparent text-red-600 hover:bg-red-50 hover:text-red-700 focus-visible:ring-red-500",
    "danger-ghost": "bg-transparent text-red-600 hover:bg-red-50 focus-visible:ring-red-500",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm focus-visible:ring-emerald-600",
    // Icon button inherits base styles except shape/padding
    icon: "p-2.5 h-16 w-11 bg-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-xl focus-visible:ring-slate-500 gap-0",
  };

  // We enforce consistent sizing by overriding sizes. md is standard.
  const sizes = {
    xs: "h-9 px-3.5 text-xs gap-1.5",
    sm: "h-10 px-4 text-sm gap-1.5",
    md: "h-16 px-8 text-[15px] gap-2",
    lg: "h-12 px-6 text-base gap-2",
    icon: "p-0 h-16 w-11",
  };

  const buttonClass = cn(
    variant === "icon" ? "" : baseStyles,
    variant === "icon" ? "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none" : "",
    variants[variant],
    variant === "icon" ? sizes.icon : sizes[size],
    className
  );

  return (
    <button
      className={buttonClass}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4.5 h-4.5 animate-spin shrink-0" />
      ) : Icon && variant !== "icon" ? (
        <Icon className="w-[28px] h-[28px] shrink-0" />
      ) : null}
      {variant === "icon" && Icon && !loading ? <Icon className="w-[32px] h-[32px]" /> : children}
    </button>
  );
}
