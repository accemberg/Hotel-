"use client";
import React from "react";
import { cn } from "@/lib/utils";

export function AdminTable({ headers = [], children, className }) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]", className)}>
      <table className="w-full text-left text-xl">
        <thead className="bg-slate-50/80 border-b border-slate-200/80">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} scope="col" className="px-5 py-3.5 text-lg font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {children}
        </tbody>
      </table>
    </div>
  );
}

export function AdminTableRow({ children, className, ...props }) {
  return (
    <tr className={cn("hover:bg-slate-50/50 transition-colors", className)} {...props}>
      {children}
    </tr>
  );
}

export function AdminTableCell({ children, className, ...props }) {
  return (
    <td className={cn("px-5 py-4 text-xl text-slate-600", className)} {...props}>
      {children}
    </td>
  );
}
