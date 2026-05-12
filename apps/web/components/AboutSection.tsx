import type { Dictionary } from "@/i18n/types";

interface AboutSectionProps {
  copy: Dictionary["about"];
}

export function AboutSection({ copy }: AboutSectionProps) {
  return (
    <section className="section-shell grid gap-6 py-20 lg:grid-cols-[0.8fr_1.2fr]" id="about">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">{copy.eyebrow}</p>
        <h2 className="mt-4 font-display text-4xl font-semibold text-[var(--color-text)] sm:text-5xl">{copy.title}</h2>
      </div>
      <div className="glass-panel rounded-[32px] p-7 sm:p-9">
        <p className="text-lg leading-9 text-[var(--color-muted)]">{copy.body}</p>
        <div className="mt-7 rounded-[24px] border border-[color-mix(in_srgb,var(--color-red)_34%,transparent)] bg-[color-mix(in_srgb,var(--color-red)_10%,transparent)] p-5 text-base font-semibold leading-7 text-[var(--color-text)]">
          {copy.warning}
        </div>
      </div>
    </section>
  );
}
