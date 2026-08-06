"use client";
import React from "react";
import { cn } from "@/lib/utils";

export function AdminCard({ children, className, padding = "p-6", hover = false, ...props }) {
  return (
    <div 
      className={cn(
        "bg-white rounded-xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-300 ease-out", 
        padding,
        hover && "hover:shadow-[0_12px_36px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:border-slate-300/90",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
