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
        "glass-panel rounded-[28px]",
        className,
      )}
    >
      {children}
    </section>
  );
}
