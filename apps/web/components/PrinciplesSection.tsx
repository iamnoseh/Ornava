import type { Dictionary } from "@/i18n/types";

interface PrinciplesSectionProps {
  copy: Dictionary["principles"];
}

export function PrinciplesSection({ copy }: PrinciplesSectionProps) {
  return (
    <section className="section-shell py-20">
      <div className="glass-panel rounded-[36px] p-7 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">{copy.eyebrow}</p>
        <h2 className="mt-4 font-display text-4xl font-semibold text-[var(--color-text)] sm:text-5xl">{copy.title}</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {copy.items.map((item) => (
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-soft)] px-4 py-5 text-sm font-semibold text-[var(--color-text)]" key={item}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
