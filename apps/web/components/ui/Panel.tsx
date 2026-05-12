import type { ReactNode } from "react";

import { cx } from "@/lib/ui";

interface PanelProps {
  children: ReactNode;
  className?: string;
}

export function Panel({ children, className }: PanelProps) {
  return (
    <section
      className={cx(
        "border border-white/12 bg-white/[0.075] shadow-glass backdrop-blur-2xl",
        "rounded-[28px]",
        className,
      )}
    >
      {children}
    </section>
  );
}
