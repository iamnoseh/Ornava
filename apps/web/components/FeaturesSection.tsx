import type { Dictionary } from "@/i18n/types";

interface FeaturesSectionProps {
  copy: Dictionary["features"];
}

export function FeaturesSection({ copy }: FeaturesSectionProps) {
  return (
    <section className="section-shell py-20" id="features">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">{copy.eyebrow}</p>
        <h2 className="mt-4 font-display text-4xl font-semibold text-[var(--color-text)] sm:text-5xl">{copy.title}</h2>
        <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">{copy.description}</p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {copy.items.map((item) => (
          <article className="glass-panel rounded-[28px] p-6" key={item.title}>
            <h3 className="font-display text-2xl font-semibold text-[var(--color-text)]">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
