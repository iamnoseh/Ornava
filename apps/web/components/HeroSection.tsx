"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/i18n/types";

interface HeroSectionProps {
  copy: Dictionary["hero"];
}

export function HeroSection({ copy }: HeroSectionProps) {
  return (
    <section className="section-shell grid min-h-[calc(100vh-5rem)] items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr]" id="top">
      <div>
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-gold)]"
          initial={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.55 }}
        >
          {copy.eyebrow}
        </motion.p>

        <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 14 }} transition={{ delay: 0.08, duration: 0.7 }}>
          <h1 className="mt-7 max-w-4xl font-display text-5xl font-semibold leading-[0.98] text-[var(--color-text)] sm:text-7xl">
            {copy.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">{copy.subtitle}</p>
        </motion.div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => document.querySelector("#restoration")?.scrollIntoView({ behavior: "smooth" })}>
            {copy.primaryCta}
          </Button>
          <Button onClick={() => document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" })} variant="secondary">
            {copy.secondaryCta}
          </Button>
        </div>

        <div className="mt-8 grid max-w-2xl gap-3 text-sm text-[var(--color-muted)] sm:grid-cols-3">
          {copy.principles.map((item) => (
            <div className="rounded-full border border-[var(--color-border)] bg-[var(--color-soft)] px-4 py-3 text-center" key={item}>
              {item}
            </div>
          ))}
        </div>
      </div>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel relative overflow-hidden rounded-[36px] p-5"
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.16, duration: 0.75 }}
      >
        <div className="absolute inset-0 bg-[url('/ornament-field.svg')] bg-cover bg-center opacity-20" />
        <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_72%,transparent)]">
          <div className="absolute inset-8 rounded-full border border-[color-mix(in_srgb,var(--color-gold)_34%,transparent)]" />
          <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color-mix(in_srgb,var(--color-red)_42%,transparent)]" />
          <div className="absolute inset-x-10 top-1/2 h-px bg-[color-mix(in_srgb,var(--color-gold)_36%,transparent)]" />
          <div className="absolute inset-y-10 left-1/2 w-px bg-[color-mix(in_srgb,var(--color-gold)_36%,transparent)]" />
        </div>
      </motion.div>
    </section>
  );
}
