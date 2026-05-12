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
          "bg-[var(--color-gold)] text-[#16110d] shadow-glow hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/60",
        variant === "secondary" &&
          "border border-[color-mix(in_srgb,var(--color-gold)_40%,transparent)] bg-[var(--color-soft)] text-[var(--color-text)] hover:border-[var(--color-gold)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40",
        variant === "ghost" && "text-[var(--color-muted)] hover:text-[var(--color-text)]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
