import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Printed like a ticket reference, e.g. "No. 02 · The Route". */
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  className?: string;
  id?: string;
}

export function SectionHeading({ eyebrow, title, children, className, id }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-xl", className)}>
      <p className="text-eyebrow flex items-center gap-3 text-brass">
        <span className="h-px w-8 bg-brass/60" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 id={id} className="text-h2 mt-4 text-espresso">
        {title}
      </h2>
      {children && <div className="mt-4 text-espresso/80">{children}</div>}
    </div>
  );
}
