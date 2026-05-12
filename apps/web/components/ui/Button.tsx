import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cx } from "@/lib/ui";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({ children, className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cx(
        "inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-55",
        variant === "primary" &&
          "bg-heritage-gold text-heritage-black shadow-glow hover:bg-[#d8b43a] focus:outline-none focus:ring-2 focus:ring-heritage-gold/60",
        variant === "secondary" &&
          "border border-heritage-gold/35 bg-white/8 text-heritage-paper hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-heritage-gold/40",
        variant === "ghost" && "text-heritage-paper/80 hover:text-heritage-paper",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
