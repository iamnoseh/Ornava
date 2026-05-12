"use client";

import { apiAssetUrl } from "@/lib/config";
import type { Dictionary } from "@/i18n/types";
import type { RestorationResponse } from "@/types/restoration";

interface ResultPanelProps {
  result: RestorationResponse;
  copy: Dictionary;
}

export function ResultPanel({ result, copy }: ResultPanelProps) {
  const downloadUrl = apiAssetUrl(result.output_url);
  const resultCopy = copy.result;
  const hasProviderIssue = Boolean(result.provider_error_code);
  const method = result.fallback_used || result.provider === "deterministic" ? resultCopy.methodSafe : resultCopy.methodAi;
  const modeLabel = copy.controls.modes[result.mode]?.label ?? result.mode;

  return (
    <aside className="glass-panel rounded-lg p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">{resultCopy.recordEyebrow}</p>
          <h2 className="mt-2 font-display text-3xl text-[var(--color-text)]">{resultCopy.recordTitle}</h2>
        </div>
        <a
          className="inline-flex min-h-11 items-center rounded-full bg-[var(--color-text)] px-5 text-sm font-semibold text-[var(--color-bg)] transition hover:opacity-90"
          download
          href={downloadUrl}
        >
          {resultCopy.download}
        </a>
      </div>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        <Meta label={resultCopy.method} value={method} tone={result.fallback_used ? "warn" : "normal"} />
        <Meta label={resultCopy.mode} value={modeLabel} />
        <Meta label={resultCopy.status} value={resultCopy.statusComplete} />
      </dl>

      {hasProviderIssue && (
        <div className="mt-5 rounded-lg border border-[color-mix(in_srgb,var(--color-gold)_28%,transparent)] bg-[color-mix(in_srgb,var(--color-gold)_10%,transparent)] p-4">
          <p className="text-sm font-semibold text-[var(--color-text)]">{resultCopy.quotaTitle}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{resultCopy.quotaMessage}</p>
        </div>
      )}

      <p className="mt-5 text-sm leading-6 text-[var(--color-muted)]">{resultCopy.successMessage}</p>

      <details className="mt-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-soft)] p-4">
        <summary className="cursor-pointer text-sm font-semibold text-[var(--color-text)]">
          {resultCopy.technicalDetails}
        </summary>
        <p className="mt-3 text-xs leading-5 text-[var(--color-muted)]">{resultCopy.technicalIntro}</p>
        <dl className="mt-4 grid gap-2 text-xs">
          <TechnicalMeta label="provider" value={result.provider} />
          <TechnicalMeta label="fallback_used" value={String(result.fallback_used)} />
          <TechnicalMeta label="ai_model" value={result.ai_model ?? "null"} />
          <TechnicalMeta label="provider_error_code" value={result.provider_error_code ?? "null"} />
          <TechnicalMeta label="provider_error_message" value={result.provider_error_message ?? "null"} />
          <TechnicalMeta label="message" value={result.message} />
        </dl>
      </details>
    </aside>
  );
}

function Meta({ label, value, tone = "normal" }: { label: string; value: string; tone?: "normal" | "warn" }) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-soft)] p-4">
      <dt className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">{label}</dt>
      <dd className={tone === "warn" ? "mt-2 text-sm font-semibold text-[var(--color-gold)]" : "mt-2 text-sm font-semibold text-[var(--color-text)]"}>
        {value}
      </dd>
    </div>
  );
}

function TechnicalMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-lg border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-bg)_28%,transparent)] p-3">
      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-muted)]">{label}</dt>
      <dd className="break-words font-mono text-[11px] leading-5 text-[var(--color-text)]">{value}</dd>
    </div>
  );
}
