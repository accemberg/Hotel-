"use client";
import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminModal({ 
  isOpen, 
  onClose, 
  title, 
  description,
  children, 
  footer, 
  maxWidth = "max-w-lg" 
}) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 backdrop-blur-[2px] p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={cn(
          "relative w-full rounded-xl bg-white shadow-2xl ring-1 ring-slate-200/50 animate-in zoom-in-95 slide-in-from-bottom-2 duration-200",
          maxWidth
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-12 py-10 border-b border-slate-100">
          <div>
            <h3 className="font-serif text-4xl font-bold text-slate-900 leading-tight">{title}</h3>
            {description && <p className="mt-1.5 text-xl text-slate-500 mt-3">{description}</p>}
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors -mr-2"
            aria-label="Close"
          >
            <X className="h-8 w-8" />
          </button>
        </div>
        
        {/* Body */}
        <div className="px-12 py-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-6 bg-white px-12 py-8 rounded-b-xl border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
