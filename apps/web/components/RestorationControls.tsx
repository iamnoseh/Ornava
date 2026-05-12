"use client";

import type { RestorationMode } from "@/types/restoration";
import type { Dictionary } from "@/i18n/types";
import { cx } from "@/lib/ui";

const MODE_VALUES: RestorationMode[] = ["conservative", "balanced", "strong"];

interface RestorationControlsProps {
  mode: RestorationMode;
  useAi: boolean;
  disabled: boolean;
  copy: Dictionary["controls"];
  onModeChange: (mode: RestorationMode) => void;
  onUseAiChange: (useAi: boolean) => void;
}

export function RestorationControls({
  mode,
  useAi,
  disabled,
  copy,
  onModeChange,
  onUseAiChange,
}: RestorationControlsProps) {
  return (
    <div className="space-y-5">
      <div>
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-[var(--color-text)]">{copy.modeLabel}</p>
          <p className="text-xs text-[var(--color-muted)]">{copy.modeHint}</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {MODE_VALUES.map((value) => {
            const item = copy.modes[value];
            return (
            <button
              className={cx(
                "min-h-[92px] rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60",
                mode === value
                  ? "border-[var(--color-gold)] bg-[color-mix(in_srgb,var(--color-gold)_16%,transparent)]"
                  : "border-[var(--color-border)] bg-[var(--color-soft)] hover:border-[color-mix(in_srgb,var(--color-gold)_46%,transparent)]",
              )}
              disabled={disabled}
              key={value}
              onClick={() => onModeChange(value)}
              type="button"
            >
              <span className="block text-sm font-semibold text-[var(--color-text)]">{item.label}</span>
              <span className="mt-2 block text-xs leading-5 text-[var(--color-muted)]">{item.description}</span>
            </button>
          );
          })}
        </div>
      </div>

      <label className="flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-soft)] px-4">
        <span>
          <span className="block text-sm font-semibold text-[var(--color-text)]">{copy.aiTitle}</span>
          <span className="block text-xs text-[var(--color-muted)]">{copy.aiDescription}</span>
        </span>
        <input
          checked={useAi}
          className="sr-only"
          disabled={disabled}
          onChange={(event) => onUseAiChange(event.target.checked)}
          type="checkbox"
        />
        <span className={cx("relative h-7 w-12 rounded-full transition", useAi ? "bg-[var(--color-gold)]" : "bg-[var(--color-border)]")}>
          <span
            className={cx(
              "absolute left-1 top-1 h-5 w-5 rounded-full transition",
              useAi ? "translate-x-5 bg-[#16110d]" : "bg-[var(--color-surface)]",
            )}
          />
        </span>
      </label>
    </div>
  );
}
