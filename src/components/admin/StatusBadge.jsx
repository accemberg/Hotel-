"use client";
import React from "react";
import { cn } from "@/lib/utils";

export function StatusBadge({ status, size = "sm", className }) {
  const normalized = (status || "").toLowerCase();
  
  let styles = "bg-slate-50 text-slate-600 ring-slate-200/60"; // default
  let dot = "bg-slate-400";
  
  switch(normalized) {
    case "available":
    case "active":
    case "checked in":
    case "clean":
      styles = "bg-emerald-50 text-emerald-700 ring-emerald-200/60";
      dot = "bg-emerald-500";
      break;
    case "dirty":
      styles = "bg-red-50 text-red-700 ring-red-200/60";
      dot = "bg-red-500";
      break;
    case "cleaning in progress":
    case "cleaning":
      styles = "bg-amber-50 text-amber-700 ring-amber-200/60";
      dot = "bg-amber-500";
      break;
    case "completed":
      styles = "bg-indigo-50 text-indigo-700 ring-indigo-200/60";
      dot = "bg-indigo-500";
      break;
    case "new":
      styles = "bg-blue-50 text-blue-700 ring-blue-200/60";
      dot = "bg-blue-500";
      break;
    case "occupied":
    case "confirmed":
    case "success":
      styles = "bg-blue-50 text-blue-700 ring-blue-200/60";
      dot = "bg-blue-500";
      break;
    case "booked":
    case "reserved":
    case "contacted":
      styles = "bg-amber-50 text-amber-700 ring-amber-200/60";
      dot = "bg-amber-500";
      break;
    case "out of service":
    case "maintenance":
    case "hidden":
    case "inactive":
      styles = "bg-slate-100 text-slate-700 ring-slate-200/60";
      dot = "bg-slate-500";
      break;
    case "cancelled":
    case "error":
      styles = "bg-red-50 text-red-700 ring-red-200/60";
      dot = "bg-red-500";
      break;
  }

  const sizeClasses = {
    xs: "px-4 py-1 text-[16px]",
    sm: "px-5 py-2 text-[18px]",
    md: "px-6 py-2.5 text-[20px]",
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset whitespace-nowrap",
      sizeClasses[size],
      styles, 
      className
    )}>
      <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", dot)} />
      {status || "Unknown"}
    </span>
  );
}
