"use client";

import { apiAssetUrl } from "@/lib/config";
import type { RestorationResponse } from "@/types/restoration";

interface RestorationResultCardProps {
  result: RestorationResponse;
}

export function RestorationResultCard({ result }: RestorationResultCardProps) {
  const downloadUrl = apiAssetUrl(result.output_url);
  const isQuota = result.provider_error_code === "gemini_quota_exceeded";

  return (
    <aside className="rounded-[24px] border border-white/10 bg-white/[0.055] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-heritage-gold/[0.78]">Restoration record</p>
          <h2 className="mt-2 font-display text-3xl text-heritage-paper">Authenticity report</h2>
        </div>
        <a
          className="inline-flex min-h-11 items-center rounded-full bg-heritage-paper px-5 text-sm font-semibold text-heritage-black transition hover:bg-white"
          download
          href={downloadUrl}
        >
          Download
        </a>
      </div>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        <Meta label="Provider" value={result.provider} />
        <Meta label="Mode" value={result.mode} />
        <Meta label="Fallback" value={result.fallback_used ? "Used" : "No"} tone={result.fallback_used ? "warn" : "normal"} />
        <Meta label="AI model" value={result.ai_model ?? "None"} />
      </dl>

      {result.provider_error_code && (
        <div className="mt-5 rounded-2xl border border-heritage-gold/[0.24] bg-heritage-gold/10 p-4">
          <p className="text-sm font-semibold text-heritage-paper">
            {isQuota ? "Gemini limit reached" : "Provider fallback"}
          </p>
          <p className="mt-2 text-sm leading-6 text-heritage-paper/[0.68]">
            {result.provider_error_message ?? "The deterministic restoration was used instead."}
          </p>
          <code className="mt-3 block text-xs text-heritage-gold">{result.provider_error_code}</code>
        </div>
      )}

      <p className="mt-5 text-sm leading-6 text-heritage-paper/[0.62]">{result.message}</p>
    </aside>
  );
}

function Meta({ label, value, tone = "normal" }: { label: string; value: string; tone?: "normal" | "warn" }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-heritage-black/[0.22] p-4">
      <dt className="text-xs uppercase tracking-[0.18em] text-heritage-paper/[0.42]">{label}</dt>
      <dd className={tone === "warn" ? "mt-2 text-sm font-semibold text-heritage-gold" : "mt-2 text-sm font-semibold text-heritage-paper"}>
        {value}
      </dd>
    </div>
  );
}
