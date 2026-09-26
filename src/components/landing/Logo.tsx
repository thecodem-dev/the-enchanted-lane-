import logoUrl from "@/assets/landing/enchanted-lane-logo.png";
import { cn } from "@/lib/utils";

/** The square source logo, cropped to a circle in CSS rather than pre-edited. */
export function Logo({ className }: { className?: string }) {
  return (
    <img
      src={logoUrl}
      alt=""
      aria-hidden="true"
      className={cn("aspect-square shrink-0 rounded-full object-cover", className)}
    />
  );
}
