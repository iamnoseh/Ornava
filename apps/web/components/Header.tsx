"use client";

import type { Dictionary, Language } from "@/i18n/types";
import type { Theme } from "@/lib/theme";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  copy: Dictionary;
  language: Language;
  theme: Theme;
  onLanguageChange: (language: Language) => void;
  onThemeToggle: () => void;
}

export function Header({ copy, language, theme, onLanguageChange, onThemeToggle }: HeaderProps) {
  const links = [
    { href: "#features", label: copy.nav.features },
    { href: "#process", label: copy.nav.process },
    { href: "#restoration", label: copy.nav.restoration },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-bg)_88%,transparent)] backdrop-blur-2xl">
      <div className="section-shell flex min-h-16 flex-wrap items-center justify-between gap-4 py-3">
        <a className="flex items-center gap-3" href="#top">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-[var(--color-gold)] bg-[color-mix(in_srgb,var(--color-gold)_12%,transparent)] font-display text-xl text-[var(--color-gold)]">
            O
          </span>
          <span>
            <span className="block font-display text-2xl font-semibold leading-none text-[var(--color-text)]">Ornava</span>
            <span className="block text-xs text-[var(--color-muted)]">{copy.header.productLabel}</span>
          </span>
        </a>

        <nav className="order-3 flex w-full flex-wrap justify-center gap-2 text-sm text-[var(--color-muted)] lg:order-2 lg:w-auto">
          {links.map((link) => (
            <a className="rounded-full px-3 py-2 transition hover:bg-[var(--color-soft)] hover:text-[var(--color-text)]" href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="order-2 flex items-center gap-2 lg:order-3">
          <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} />
          <ThemeToggle copy={copy.header} onToggle={onThemeToggle} theme={theme} />
        </div>
      </div>
    </header>
  );
}
