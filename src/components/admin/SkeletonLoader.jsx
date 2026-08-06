"use client";
import React from "react";
import { cn } from "@/lib/utils";

export function SkeletonLoader({ type = "card", className, count = 1 }) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  if (type === "card") {
    return (
      <>
        {skeletons.map((i) => (
          <div key={i} className={cn("bg-white rounded-2xl border border-slate-200 p-6 animate-pulse", className)}>
            <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
            <div className="h-10 bg-slate-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
          </div>
        ))}
      </>
    );
  }

  if (type === "table") {
    return (
      <div className={cn("w-full animate-pulse", className)}>
        <div className="h-12 bg-slate-200 rounded-t-lg mb-2"></div>
        {skeletons.map((i) => (
          <div key={i} className="h-16 bg-slate-100 mb-1 rounded"></div>
        ))}
      </div>
    );
  }

  // default block
  return (
    <>
      {skeletons.map((i) => (
        <div key={i} className={cn("h-4 bg-slate-200 rounded animate-pulse", className)}></div>
      ))}
    </>
  );
}
