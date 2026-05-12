"use client";

import type { Dictionary } from "@/i18n/types";
import type { Theme } from "@/lib/theme";

interface ThemeToggleProps {
  theme: Theme;
  copy: Dictionary["header"];
  onToggle: () => void;
}

export function ThemeToggle({ theme, copy, onToggle }: ThemeToggleProps) {
  const label = theme === "dark" ? copy.themeLight : copy.themeDark;
  const mark = theme === "dark" ? "L" : "D";

  return (
    <button
      aria-label={label}
      className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-soft)] px-3 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-gold)]"
      onClick={onToggle}
      type="button"
    >
      <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--color-gold)] text-xs text-[#16110d]">
        {mark}
      </span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
