"use client";

import { useEffect, useMemo, useState } from "react";

import { AboutSection } from "@/components/AboutSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { PrinciplesSection } from "@/components/PrinciplesSection";
import { RestorationWorkspace } from "@/components/RestorationWorkspace";
import { DEFAULT_LANGUAGE, dictionaries } from "@/i18n/dictionaries";
import type { Language } from "@/i18n/types";
import { applyTheme, getInitialTheme, type Theme } from "@/lib/theme";

export function HomeExperience() {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  const copy = useMemo(() => dictionaries[language], [language]);

  function handleThemeToggle() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <main className="heritage-scrollbar relative min-h-screen overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="ornament-grid pointer-events-none fixed inset-0 opacity-70" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-gradient-to-b from-[color-mix(in_srgb,var(--color-gold)_14%,transparent)] to-transparent" />

      <div className="relative">
        <Header
          copy={copy}
          language={language}
          onLanguageChange={setLanguage}
          onThemeToggle={handleThemeToggle}
          theme={mounted ? theme : "dark"}
        />
        <HeroSection copy={copy.hero} />
        <RestorationWorkspace copy={copy} />
        <FeaturesSection copy={copy.features} />
        <HowItWorksSection copy={copy.howItWorks} />
        <AboutSection copy={copy.about} />
        <PrinciplesSection copy={copy.principles} />
        <Footer copy={copy} />
      </div>
    </main>
  );
}
