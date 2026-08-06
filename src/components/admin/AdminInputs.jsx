"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export const AdminInput = React.forwardRef(({ label, error, hint, className, required, ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label className="block text-[22px] font-bold text-slate-700 mb-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <input
      ref={ref}
      className={cn(
        "block w-full rounded-lg border border-slate-200 bg-white px-6 py-4 text-[20px] text-slate-900 placeholder-slate-400 shadow-sm transition-all focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10",
        error && "border-red-300 focus:border-red-400 focus:ring-red-500/10",
        className
      )}
      required={required}
      {...props}
    />
    {hint && !error && <p className="mt-2 text-lg text-slate-400">{hint}</p>}
    {error && <p className="mt-2 text-lg text-red-600 font-medium">{error}</p>}
  </div>
));
AdminInput.displayName = "AdminInput";

export const AdminTextarea = React.forwardRef(({ label, error, hint, className, required, ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label className="block text-[22px] font-bold text-slate-700 mb-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <textarea
      ref={ref}
      className={cn(
        "block w-full rounded-lg border border-slate-200 bg-white px-6 py-4 text-[20px] text-slate-900 placeholder-slate-400 shadow-sm transition-all resize-y min-h-[100px] leading-relaxed focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10",
        error && "border-red-300 focus:border-red-400 focus:ring-red-500/10",
        className
      )}
      {...props}
    />
    {hint && !error && <p className="mt-2 text-lg text-slate-400">{hint}</p>}
    {error && <p className="mt-2 text-lg text-red-600 font-medium">{error}</p>}
  </div>
));
AdminTextarea.displayName = "AdminTextarea";

export const AdminSelect = React.forwardRef(({ label, error, options = [], className, required, ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label className="block text-[22px] font-bold text-slate-700 mb-3">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <select
      ref={ref}
      className={cn(
        "block w-full rounded-lg border border-slate-200 bg-white px-6 py-4 text-[20px] text-slate-900 shadow-sm transition-all appearance-none cursor-pointer focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 pr-10",
        error && "border-red-300 focus:border-red-400 focus:ring-red-500/10",
        className
      )}
      style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="mt-2 text-lg text-red-600 font-medium">{error}</p>}
  </div>
));
AdminSelect.displayName = "AdminSelect";

export function SearchInput({ placeholder = "Search...", value, onChange, className }) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-400 pointer-events-none" />
      <input 
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="block w-full rounded-xl border border-slate-200 bg-white pl-20 pr-6 py-5 text-2xl text-slate-900 placeholder-slate-400 shadow-sm transition-all focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
      />
    </div>
  );
}
