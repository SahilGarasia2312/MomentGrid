"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-brand-primary text-surface-0 hover:bg-brand-primary/80",
        secondary:
          "border-transparent bg-surface-2 text-textPalette-primary hover:bg-surface-3",
        outline: "text-textPalette-primary border border-borderColor",
        gold: "border border-[#D4A052]/35 bg-gradient-to-r from-[#D4A052]/15 via-[#E5B873]/20 to-[#D4A052]/15 text-[#D4A052] font-bold tracking-wider uppercase",
        emerald: "border border-[#234F60]/40 bg-gradient-to-r from-[#234F60]/20 to-[#35677B]/25 text-[#234F60] dark:text-[#DFE6E6] font-bold tracking-wider uppercase",
        burgundy: "border border-[#234F60]/40 bg-gradient-to-r from-[#234F60]/20 to-[#121111]/30 text-[#234F60] dark:text-[#DFE6E6] font-bold tracking-wider uppercase",
        obsidian: "border border-white/15 bg-[#121111]/95 text-white/90 font-bold tracking-wider uppercase shadow-md",
        success: "border-transparent bg-[#DFE6E6] text-[#234F60] font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
