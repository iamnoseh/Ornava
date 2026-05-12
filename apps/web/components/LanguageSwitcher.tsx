"use client";

import { languageOptions } from "@/i18n/dictionaries";
import type { Language } from "@/i18n/types";
import { cx } from "@/lib/ui";

interface LanguageSwitcherProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSwitcher({ language, onLanguageChange }: LanguageSwitcherProps) {
  return (
    <div className="flex rounded-full border border-[var(--color-border)] bg-[var(--color-soft)] p-1">
      {languageOptions.map((option) => (
        <button
          className={cx(
            "min-h-9 rounded-full px-3 text-xs font-semibold transition sm:text-sm",
            language === option.value
              ? "bg-[var(--color-gold)] text-[#16110d]"
              : "text-[var(--color-muted)] hover:text-[var(--color-text)]",
          )}
          key={option.value}
          onClick={() => onLanguageChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
