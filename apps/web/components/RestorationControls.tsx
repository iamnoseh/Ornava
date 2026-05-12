"use client";

import type { RestorationMode } from "@/types/restoration";
import { cx } from "@/lib/ui";

const MODES: Array<{ value: RestorationMode; label: string; description: string }> = [
  {
    value: "conservative",
    label: "Conservative",
    description: "Minimal enhancement, highest fidelity.",
  },
  {
    value: "balanced",
    label: "Balanced",
    description: "Clearer details with guarded correction.",
  },
  {
    value: "strong",
    label: "Strong",
    description: "Maximum deterministic recovery.",
  },
];

interface RestorationControlsProps {
  mode: RestorationMode;
  useAi: boolean;
  disabled: boolean;
  onModeChange: (mode: RestorationMode) => void;
  onUseAiChange: (useAi: boolean) => void;
}

export function RestorationControls({
  mode,
  useAi,
  disabled,
  onModeChange,
  onUseAiChange,
}: RestorationControlsProps) {
  return (
    <div className="space-y-5">
      <div>
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-heritage-paper">Restoration mode</p>
          <p className="text-xs text-heritage-paper/[0.52]">Authenticity first</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {MODES.map((item) => (
            <button
              className={cx(
                "min-h-[92px] rounded-2xl border p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-60",
                mode === item.value
                  ? "border-heritage-gold/70 bg-heritage-gold/[0.14]"
                  : "border-white/10 bg-white/[0.045] hover:border-heritage-gold/[0.35]",
              )}
              disabled={disabled}
              key={item.value}
              onClick={() => onModeChange(item.value)}
              type="button"
            >
              <span className="block text-sm font-semibold text-heritage-paper">{item.label}</span>
              <span className="mt-2 block text-xs leading-5 text-heritage-paper/[0.58]">{item.description}</span>
            </button>
          ))}
        </div>
      </div>

      <label className="flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.045] px-4">
        <span>
          <span className="block text-sm font-semibold text-heritage-paper">AI restoration</span>
          <span className="block text-xs text-heritage-paper/[0.58]">Uses Gemini only when your backend is configured.</span>
        </span>
        <input
          checked={useAi}
          className="sr-only"
          disabled={disabled}
          onChange={(event) => onUseAiChange(event.target.checked)}
          type="checkbox"
        />
        <span className={cx("relative h-7 w-12 rounded-full transition", useAi ? "bg-heritage-gold" : "bg-white/[0.14]")}>
          <span
            className={cx(
              "absolute left-1 top-1 h-5 w-5 rounded-full transition",
              useAi ? "translate-x-5 bg-heritage-black" : "bg-heritage-paper",
            )}
          />
        </span>
      </label>
    </div>
  );
}
