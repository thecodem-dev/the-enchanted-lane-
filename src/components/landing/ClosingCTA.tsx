import { tornTopEdge } from "@/lib/tornEdge";
import { BOARD_PATH, goToBoard } from "@/lib/navigation";

export function ClosingCTA() {
  return (
    <section aria-labelledby="closing-title" className="relative bg-espresso text-cream">
      {/* Same torn edge as the route section, ripped from the other end of the sheet. */}
      <div
        className="absolute inset-x-0 -top-[17px] h-[18px] bg-espresso"
        style={{ clipPath: tornTopEdge(110, 3) }}
        aria-hidden="true"
      />

      {/* Perforation row across the top, as if this section were the last ticket in the book. */}
      <div
        className="absolute inset-x-0 top-10 h-[6px] opacity-40"
        style={{
          background: "radial-gradient(circle 2px, var(--color-sage) 98%, transparent) 0 50% / 14px 6px repeat-x",
        }}
        aria-hidden="true"
      />

      <div className="guilloche absolute inset-0 opacity-60" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-5 py-28 md:px-8 md:py-36">
        <p className="text-eyebrow flex items-center gap-3 text-sage">
          <span className="h-px w-8 bg-sage/70" aria-hidden="true" />
          Last call · Platform IX
        </p>

        <h2 id="closing-title" className="text-hero mt-6 max-w-[18ch]">
          Come wander this enchanted lane with us. We saved you the window seat.
        </h2>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href={BOARD_PATH} onClick={goToBoard}
            className="text-label rounded-btn bg-rust px-8 py-4 text-cream ring-1 ring-cream/20 transition-colors hover:bg-cream hover:text-espresso"
          >
            Start the journey
          </a>
          <p className="text-label text-sage">Free to board. Pretoria departs whenever you're ready.</p>
        </div>
      </div>
    </section>
  );
}
