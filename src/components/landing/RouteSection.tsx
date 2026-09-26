import { useRef, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { STATIONS } from "@/data/stations";
import { TicketStub } from "./TicketStub";
import { SectionHeading } from "./SectionHeading";
import { tornTopEdge } from "@/lib/tornEdge";
import { BOARD_PATH, goToBoard } from "@/lib/navigation";

// Hand-set rather than random so the "stack of old tickets" looks the same on every visit.
const TILT = [-2.2, 1.4, -0.8, 2, -1.6, 0.9, -1.8, 1.5, -0.6];
const LIFT = [0, 10, -4, 6, -8, 4, -2, 8, -6];

export function RouteSection() {
  const scroller = useRef<HTMLDivElement>(null);

  const nudge = (dir: 1 | -1) => {
    scroller.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section id="route" aria-labelledby="route-title" className="relative z-10 bg-tan py-24 md:py-28">
      {/* Torn paper edge biting into the hero footage above. */}
      <div
        className="absolute inset-x-0 -top-[17px] h-[18px] bg-tan"
        style={{ clipPath: tornTopEdge() }}
        aria-hidden="true"
      />

      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 md:flex-row md:items-end md:justify-between md:px-8">
        <SectionHeading id="route-title" eyebrow="No. 01 · The Route" title="Nine stops, and not one of them boring">
          <p>
            From jacaranda-purple Pretoria to the foot of Table Mountain, the line crosses gold reefs, diamond fields
            and a Karoo so quiet you can hear the stars. Here's your stack of tickets. Have a shuffle.
          </p>
        </SectionHeading>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => nudge(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-espresso/25 text-espresso transition-colors hover:border-rust hover:bg-rust hover:text-cream"
            aria-label="Previous stations"
          >
            <ArrowLeft size={18} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-espresso/25 text-espresso transition-colors hover:border-rust hover:bg-rust hover:text-cream"
            aria-label="Next stations"
          >
            <ArrowRight size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="no-scrollbar mt-14 snap-x snap-mandatory overflow-x-auto scroll-px-5 md:scroll-px-[max(2rem,calc((100vw_-_72rem)/2_+_2rem))]"
        tabIndex={0}
        aria-label="Stations from Pretoria to Cape Town, scroll horizontally"
      >
        <ol className="relative flex w-max items-center gap-6 px-5 py-10 md:px-[max(2rem,calc((100vw_-_72rem)/2_+_2rem))]">
          {/* The track: two rails and sleepers running behind every ticket. */}
          <li
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/2 h-4 -translate-y-1/2"
            style={{
              background:
                "linear-gradient(var(--color-espresso), var(--color-espresso)) 0 0 / 100% 1px no-repeat, linear-gradient(var(--color-espresso), var(--color-espresso)) 0 100% / 100% 1px no-repeat, repeating-linear-gradient(90deg, color-mix(in srgb, var(--color-brass) 70%, transparent) 0 2px, transparent 2px 14px)",
              opacity: 0.35,
            }}
          />

          {STATIONS.map((station, i) => {
            const label = i === 0 ? "Departs" : i === STATIONS.length - 1 ? "Terminus" : `Stop ${i + 1} of 9`;
            return (
              <li
                key={station.id}
                className="group relative snap-start"
                style={{ transform: `translateY(${LIFT[i]}px) rotate(${TILT[i]}deg)` }}
              >
                <TicketStub
                  stub={station.num}
                  serial={`EL · ${String(i + 1).padStart(3, "0")} · ${station.id.replace("_", " ").toUpperCase()}`}
                  className="h-[168px] w-[272px] transition-transform duration-300 ease-out group-hover:-translate-y-2 group-hover:-rotate-[var(--untilt)]"
                  style={
                    {
                      "--untilt": `${TILT[i]}deg`,
                      backgroundColor:
                        i % 3 === 1
                          ? "color-mix(in srgb, var(--color-cream) 82%, var(--color-sage))"
                          : "var(--color-cream)",
                      boxShadow: "0 1px 0 rgb(62 35 24 / 0.08)",
                    } as CSSProperties
                  }
                >
                  <span className="text-eyebrow text-brass">{label}</span>
                  <h3 className="text-h3 mt-2 truncate">{station.name}</h3>
                  <p className="text-espresso/75 italic">{station.subtitle}</p>
                </TicketStub>
              </li>
            );
          })}

          {/* One blank ticket left on the pile, for the visitor. */}
          <li className="relative snap-start" style={{ transform: "rotate(1.2deg)" }}>
            <a
              href={BOARD_PATH} onClick={goToBoard}
              className="group flex h-[168px] w-[220px] flex-col justify-center rounded-[3px] border border-dashed border-espresso/40 bg-tan px-6 text-espresso transition-colors hover:border-rust hover:bg-cream"
            >
              <span className="text-eyebrow text-brass">Unpunched</span>
              <span className="text-h3 mt-2">This one's yours</span>
              <span className="text-label mt-3 inline-flex items-center gap-2 text-rust">
                Claim it <ArrowRight size={14} strokeWidth={1.75} className="transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          </li>
        </ol>
      </div>
    </section>
  );
}
