import type { LucideIcon } from "lucide-react";
import { Gem, Languages, Map, Stamp } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { WaxSeal } from "./WaxSeal";

interface Feature {
  exhibit: string;
  icon: LucideIcon;
  title: string;
  body: string;
  aside: string;
}

const FEATURES: Feature[] = [
  {
    exhibit: "A",
    icon: Map,
    title: "A map that wakes up as you ride",
    body: "Every station starts out asleep, sketched in faded sepia. As your train pulls in, it blooms into colour, as if someone were walking ahead of you down a long corridor turning on the lamps.",
    aside: "No skipping ahead to Cape Town. We checked.",
  },
  {
    exhibit: "B",
    icon: Languages,
    title: "A conductor who speaks your language",
    body: "English, isiZulu, Afrikaans or Sesotho. Pick one, and the conductor tells each town's story the way a favourite uncle would: the gold rush, the Big Hole, the metal spheres older than life on Earth. Ask anything along the way.",
    aside: "You will never once hear “that's not my department.”",
  },
  {
    exhibit: "C",
    icon: Gem,
    title: "Hidden gems, handed over quietly",
    body: "Three off-the-map treasures at every stop: a thousand-year-old fig tree that counts as one living thing, penguins at arm's reach, a Victorian hotel that hasn't changed a thing since 1884.",
    aside: "The places locals only bring up after the second cup of tea.",
  },
  {
    exhibit: "D",
    icon: Stamp,
    title: "A passport with proper wax seals",
    body: "Reach a station and your digital passport gets a warm wax seal pressed onto its page. Nine seals, nine stories, and one very pleased traveller at the end of the line.",
    aside: "Yes, you're allowed to admire it. Repeatedly.",
  },
];

export function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="paper bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading id="features-title" eyebrow="No. 02 · On Board" title="Small wonders, packed for the trip">
          <p>
            Think of it as a travelling museum with a very good window seat. Here's what comes with your ticket.
          </p>
        </SectionHeading>

        {/* Laid out like a catalogue page: hairline rules, no floating cards. */}
        <ul className="mt-16 grid border-t border-espresso/20 md:grid-cols-2">
          {FEATURES.map(({ exhibit, icon: Icon, title, body, aside }, i) => (
            <li
              key={exhibit}
              className={
                "relative border-b border-espresso/20 py-10 md:px-10 md:py-12 " +
                (i % 2 === 0 ? "md:border-r md:pl-0" : "md:pr-0")
              }
            >
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-brass/50 text-brass">
                  <Icon size={19} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="text-eyebrow text-espresso/60">Exhibit {exhibit}</span>
              </div>

              <h3 className="mt-6 max-w-sm font-display text-[28px] leading-[1.1] font-normal">{title}</h3>
              <p className="mt-3 max-w-md text-espresso/80">{body}</p>
              <p className="mt-5 flex max-w-md gap-3 text-[14px] text-rust italic">
                <span className="mt-[11px] h-px w-5 shrink-0 bg-rust/60" aria-hidden="true" />
                {aside}
              </p>

              {exhibit === "D" && (
                <WaxSeal className="absolute top-3 right-0 h-16 w-16 rotate-[-14deg] md:top-10 md:h-24 md:w-24" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
