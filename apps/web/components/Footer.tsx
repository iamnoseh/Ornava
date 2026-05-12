import type { Dictionary } from "@/i18n/types";

interface FooterProps {
  copy: Dictionary;
}

export function Footer({ copy }: FooterProps) {
  const links = [copy.nav.features, copy.nav.howItWorks, copy.nav.about, copy.nav.restoration];

  return (
    <footer className="border-t border-[var(--color-border)] py-10">
      <div className="section-shell grid gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <p className="font-display text-3xl font-semibold text-[var(--color-text)]">Ornava</p>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--color-muted)]">{copy.footer.description}</p>
          <p className="mt-5 text-xs text-[var(--color-muted)]">{copy.footer.copyright}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-text)]">{copy.footer.product}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {links.map((link) => (
              <span className="rounded-full border border-[var(--color-border)] px-3 py-2 text-xs text-[var(--color-muted)]" key={link}>
                {link}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-[var(--color-muted)]">{copy.footer.languageNote}</p>
        </div>
      </div>
    </footer>
  );
}
