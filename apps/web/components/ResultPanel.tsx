"use client";

import { apiAssetUrl } from "@/lib/config";
import type { Dictionary } from "@/i18n/types";
import type { RestorationResponse } from "@/types/restoration";

interface ResultPanelProps {
  result: RestorationResponse;
  copy: Dictionary["result"];
}

export function ResultPanel({ result, copy }: ResultPanelProps) {
  const downloadUrl = apiAssetUrl(result.output_url);
  const isQuota = result.provider_error_code === "gemini_quota_exceeded";
  const providerMessage = isQuota
    ? copy.quotaMessage
    : result.provider_error_message ?? copy.providerFallback;

  return (
    <aside className="glass-panel rounded-[28px] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">{copy.recordEyebrow}</p>
          <h2 className="mt-2 font-display text-3xl text-[var(--color-text)]">{copy.recordTitle}</h2>
        </div>
        <a
          className="inline-flex min-h-11 items-center rounded-full bg-[var(--color-text)] px-5 text-sm font-semibold text-[var(--color-bg)] transition hover:opacity-90"
          download
          href={downloadUrl}
        >
          {copy.download}
        </a>
      </div>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        <Meta label={copy.provider} value={result.provider} />
        <Meta label={copy.mode} value={result.mode} />
        <Meta label={copy.fallback} value={result.fallback_used ? copy.fallbackUsed : copy.fallbackNo} tone={result.fallback_used ? "warn" : "normal"} />
        <Meta label={copy.aiModel} value={result.ai_model ?? copy.none} />
      </dl>

      {result.provider_error_code && (
        <div className="mt-5 rounded-2xl border border-[color-mix(in_srgb,var(--color-gold)_28%,transparent)] bg-[color-mix(in_srgb,var(--color-gold)_10%,transparent)] p-4">
          <p className="text-sm font-semibold text-[var(--color-text)]">
            {isQuota ? copy.quotaTitle : copy.providerFallback}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{providerMessage}</p>
          <code className="mt-3 block text-xs text-[var(--color-gold)]">{result.provider_error_code}</code>
        </div>
      )}

      <p className="mt-5 text-sm leading-6 text-[var(--color-muted)]">{result.message}</p>
    </aside>
  );
}

function Meta({ label, value, tone = "normal" }: { label: string; value: string; tone?: "normal" | "warn" }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-soft)] p-4">
      <dt className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">{label}</dt>
      <dd className={tone === "warn" ? "mt-2 text-sm font-semibold text-[var(--color-gold)]" : "mt-2 text-sm font-semibold text-[var(--color-text)]"}>
        {value}
      </dd>
    </div>
  );
}
