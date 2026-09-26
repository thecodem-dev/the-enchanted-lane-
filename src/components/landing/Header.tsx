import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { getSession } from "@/lib/auth";
import { BOARD_PATH, SIGN_IN_PATH, goToBoard, goToSignIn } from "@/lib/navigation";

const NAV = [
  { href: "#route", label: "Route" },
  { href: "#features", label: "Features" },
  { href: "#about", label: "About" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Signed-in passengers skip straight to boarding.
  const signedIn = getSession() !== null;

  // Over the video the header is see-through; once solid (scrolled or menu open) it turns cream.
  const solid = scrolled || menuOpen;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-300",
        solid
          ? "bg-cream text-espresso shadow-[0_1px_0_color-mix(in_srgb,var(--color-sage)_45%,transparent)]"
          : "bg-transparent text-cream",
      )}
    >
      <nav className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-6 px-5 md:px-8" aria-label="Main">
        <a href="#top" className="flex items-center gap-3" aria-label="The Enchanted Lane, back to top">
          <Logo className="h-10 w-10 ring-1 ring-brass/50" />
          <span className="text-label hidden tracking-[0.04em] sm:inline">The Enchanted Lane</span>
        </a>

        <ul className="text-label hidden items-center gap-9 md:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="underline-offset-[6px] decoration-brass decoration-1 transition-colors hover:underline"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href={signedIn ? BOARD_PATH : SIGN_IN_PATH}
            onClick={signedIn ? goToBoard : goToSignIn}
            className="text-label rounded-btn bg-rust px-4 py-2.5 text-cream transition-colors hover:bg-espresso"
          >
            {signedIn ? "Board Now" : "Sign In"}
          </a>
          <button
            type="button"
            className="-mr-2 p-2 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-sage/40 bg-cream px-5 pb-6 md:hidden">
          <ul className="text-label divide-y divide-sage/30">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="block py-4" onClick={() => setMenuOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
