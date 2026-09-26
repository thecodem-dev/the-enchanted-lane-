import { cn } from "@/lib/utils";

// Irregular blob outline for the poured wax, precomputed once at module load.
const OUTLINE = (() => {
  const pts: string[] = [];
  const n = 28;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = 46 + Math.sin(i * 2.7) * 2.6 + Math.cos(i * 1.3) * 1.8;
    pts.push(`${(50 + Math.cos(a) * r).toFixed(1)},${(50 + Math.sin(a) * r).toFixed(1)}`);
  }
  return pts.join(" ");
})();

/** A decorative rust wax seal, echoing the passport stamps in the app. */
export function WaxSeal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("drop-shadow-[0_2px_2px_rgb(62_35_24/0.25)]", className)} aria-hidden="true">
      <defs>
        <radialGradient id="wax" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#a8674c" />
          <stop offset="60%" stopColor="var(--color-rust)" />
          <stop offset="100%" stopColor="#6d3f2e" />
        </radialGradient>
      </defs>
      <polygon points={OUTLINE} fill="url(#wax)" />
      <circle cx="50" cy="50" r="33" fill="none" stroke="#6d3f2e" strokeWidth="1.5" opacity="0.7" />
      <circle cx="50" cy="50" r="29" fill="none" stroke="#b77c5f" strokeWidth="0.6" strokeDasharray="1.5 2.5" opacity="0.8" />
      <text
        x="50"
        y="57"
        textAnchor="middle"
        fontFamily="Poppins, sans-serif"
        fontWeight="600"
        fontSize="19"
        letterSpacing="1"
        fill="#5a3223"
        opacity="0.85"
      >
        EL
      </text>
    </svg>
  );
}
