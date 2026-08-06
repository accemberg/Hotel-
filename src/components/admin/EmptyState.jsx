"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

export function EmptyState({ icon: Icon = Inbox, title, description, action, className }) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-32 px-12 text-center rounded-xl bg-white shadow-sm border border-slate-200/50",
      className
    )}>
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-100/50 mb-6">
        <Icon className="h-10 w-10 text-slate-600" />
      </div>
      <h3 className="text-4xl font-bold text-slate-900 mb-2">{title}</h3>
      {description && (
        <p className="text-2xl text-slate-500 max-w-2xl mx-auto mb-8 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
