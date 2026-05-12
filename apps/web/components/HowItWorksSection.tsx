import type { Dictionary } from "@/i18n/types";

interface HowItWorksSectionProps {
  copy: Dictionary["howItWorks"];
}

export function HowItWorksSection({ copy }: HowItWorksSectionProps) {
  return (
    <section className="section-shell py-20" id="how-it-works">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">{copy.eyebrow}</p>
        <h2 className="mt-4 font-display text-4xl font-semibold text-[var(--color-text)] sm:text-5xl">{copy.title}</h2>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-4">
        {copy.steps.map((step, index) => (
          <article className="relative rounded-[28px] border border-[var(--color-border)] bg-[var(--color-soft)] p-6" key={step.title}>
            <div className="mb-8 grid h-11 w-11 place-items-center rounded-full bg-[var(--color-gold)] text-sm font-bold text-[#16110d]">
              {index + 1}
            </div>
            <h3 className="font-display text-2xl font-semibold text-[var(--color-text)]">{step.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
