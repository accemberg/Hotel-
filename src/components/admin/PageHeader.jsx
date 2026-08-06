"use client";
import React from "react";
import { cn } from "@/lib/utils";

export function PageHeader({ title, subtitle, action, className, children }) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[56px] font-bold text-slate-900 tracking-tight leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-2xl text-slate-600 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div className="shrink-0 flex items-center gap-3">
            {action}
          </div>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3 flex-wrap">
          {children}
        </div>
      )}
    </div>
  );
}
