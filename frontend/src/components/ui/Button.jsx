"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-brand-primary text-surface-0 shadow-md hover:bg-brand-primary/90 hover:shadow-glow",
        destructive:
          "bg-red-600 text-surface-0 shadow-sm hover:bg-red-600/90",
        outline:
          "border border-borderColor bg-surface-0 text-textPalette-primary hover:bg-surface-2 hover:text-textPalette-primary shadow-sm",
        secondary:
          "bg-surface-2 text-textPalette-primary hover:bg-surface-3 shadow-sm",
        ghost:
          "text-textPalette-secondary hover:bg-surface-2 hover:text-textPalette-primary",
        link: "text-brand-primary underline-offset-4 hover:underline",
        gold: "bg-gradient-to-r from-[#E5B873] via-[#D4A052] to-[#B08039] text-[#121111] font-bold shadow-md hover:opacity-95 hover:shadow-glow-lg border border-[#E5B873]/40",
        emerald: "bg-gradient-to-r from-[#35677B] to-[#234F60] text-white font-bold shadow-md hover:shadow-glow-emerald border border-[#DFE6E6]/30 hover:opacity-95",
        burgundy: "bg-gradient-to-r from-[#234F60] to-[#121111] text-white font-bold shadow-md hover:shadow-glow-burgundy border border-[#DFE6E6]/30 hover:opacity-95",
        obsidian: "bg-gradient-to-r from-[#121111] to-[#1D262B] text-white font-bold shadow-lg hover:bg-[#1D262B] border border-white/20 hover:border-brand-primary/50",
        dark: "bg-[#121111] text-white shadow-md hover:bg-[#121111]/90 border border-[#DFE6E6]/20",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-13 rounded-xl px-8 text-base py-3.5",
        xl: "h-14 rounded-xl px-10 text-lg py-4",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      loadingText,
      iconLeft: IconLeft,
      iconRight: IconRight,
      asChild = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        className={cn(
          buttonVariants({ variant, size, className }),
          isLoading && "opacity-80 cursor-wait"
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {loadingText || children}
          </span>
        ) : (
          <span className="inline-flex items-center justify-center gap-2 w-full">
            {IconLeft && <IconLeft className="w-4 h-4 flex-shrink-0" />}
            {children}
            {IconRight && <IconRight className="w-4 h-4 flex-shrink-0" />}
          </span>
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
