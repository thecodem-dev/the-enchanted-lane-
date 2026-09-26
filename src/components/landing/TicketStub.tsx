import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TicketStubProps {
  /** Printed on the tear-off stub, e.g. a roman numeral. */
  stub: ReactNode;
  children: ReactNode;
  serial?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * The landing page's take on the app's TicketCard: perforated on both short
 * edges (masked, so the bites are genuinely see-through), a dashed tear line
 * between stub and body, engraved guilloché, and a pair of brass rivets.
 */
export function TicketStub({ stub, children, serial, className, style }: TicketStubProps) {
  return (
    <div className={cn("ticket-perforated relative flex text-espresso", className)} style={style}>
      <div className="guilloche pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative flex w-14 shrink-0 flex-col items-center justify-between border-r border-dashed border-brass/45 py-4">
        <span className="text-h3 text-brass">{stub}</span>
        <span
          className="text-[8px] font-medium tracking-[0.25em] text-espresso/45 uppercase"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Admit one
        </span>
      </div>

      <div className="relative flex min-w-0 flex-1 flex-col py-4 pr-6 pl-5">
        {children}
        {serial && <span className="mt-auto pt-3 text-[9px] tracking-[0.2em] text-espresso/50">{serial}</span>}
      </div>

      <span className="pointer-events-none absolute top-2.5 right-3.5 h-[7px] w-[7px] rounded-full border border-brass/50" aria-hidden="true" />
      <span className="pointer-events-none absolute right-3.5 bottom-2.5 h-[7px] w-[7px] rounded-full border border-brass/50" aria-hidden="true" />
    </div>
  );
}
