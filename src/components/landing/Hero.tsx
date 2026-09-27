import { useEffect, useRef, useState } from "react";
import { ArrowDown, Pause, Play } from "lucide-react";
import heroVideo from "@/assets/landing/enchanted-header-vid2.webm";
import { BOARD_PATH, goToBoard } from "@/lib/navigation";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  // Honour reduced-motion: hold on the first frame instead of looping footage.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) videoRef.current?.pause();
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-espresso text-cream">
      <video
        ref={videoRef}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {/* Espresso wash: heavier at the bottom-left where the type sits, lighter up top so the footage breathes. */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to top, rgb(62 35 24 / 0.88) 0%, rgb(62 35 24 / 0.45) 45%, rgb(62 35 24 / 0.35) 100%), linear-gradient(to right, rgb(62 35 24 / 0.55), transparent 70%)",
        }}
      />

      <div className="mx-auto w-full max-w-6xl px-5 pt-32 pb-16 md:px-8 md:pb-24">
        <p className="text-eyebrow flex items-center gap-3 text-tan">
          <span className="h-px w-8 bg-tan/70" aria-hidden="true" />
          Pretoria to Cape Town · Nine stations
        </p>

        <h1 className="text-hero mt-6 max-w-[14ch]">History, rolling past your window</h1>

        <p className="mt-6 max-w-md text-cream/85">
          A narrated rail journey across South Africa. The map lights up as you go, a conductor tells each town's
          story in your own language, and your passport gets a new wax seal at every stop.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href={BOARD_PATH} onClick={goToBoard}
            className="text-label rounded-btn bg-rust px-7 py-3.5 text-cream ring-1 ring-cream/15 transition-colors hover:bg-cream hover:text-espresso"
          >
            Claim your ticket
          </a>
          <a
            href="#route"
            className="text-label inline-flex min-h-11 items-center gap-2 text-cream/85 underline-offset-[6px] decoration-brass hover:text-cream hover:underline"
          >
            See the route <ArrowDown size={15} strokeWidth={1.75} aria-hidden="true" />
          </a>
        </div>
      </div>

      <button
        type="button"
        onClick={toggle}
        className="absolute right-5 bottom-6 flex h-9 w-9 items-center justify-center rounded-full border border-cream/30 text-cream/80 transition-colors hover:border-cream/70 hover:text-cream md:right-8"
        aria-label={playing ? "Pause background video" : "Play background video"}
      >
        {playing ? <Pause size={14} strokeWidth={1.75} /> : <Play size={14} strokeWidth={1.75} />}
      </button>
    </section>
  );
}
