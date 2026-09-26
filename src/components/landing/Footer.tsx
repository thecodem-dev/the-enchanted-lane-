import { Logo } from "./Logo";
import { SIGN_IN_PATH, goToSignIn } from "@/lib/navigation";

const LINKS = [
  { href: "#route", label: "Route" },
  { href: "#features", label: "Features" },
  { href: SIGN_IN_PATH, label: "Sign In", onClick: goToSignIn },
];

export function Footer() {
  return (
    <footer id="about" className="bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-14 md:flex-row md:items-start md:justify-between md:px-8">
        <div className="flex max-w-sm gap-4">
          <Logo className="h-11 w-11 ring-1 ring-brass/50" />
          <div>
            <p className="text-label text-espresso">The Enchanted Lane</p>
            <p className="mt-1 text-[14px] text-espresso/75">
              A living archive of South Africa's great railway, told one station at a time.
            </p>
          </div>
        </div>

        <ul className="text-label flex gap-8 text-espresso/80">
          {LINKS.map((l) => (
            <li key={l.label}>
              <a href={l.href} onClick={"onClick" in l ? l.onClick : undefined} className="underline-offset-[6px] decoration-brass hover:text-espresso hover:underline">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto max-w-6xl border-t border-sage/50 px-5 py-6 md:px-8">
        <p className="text-[12px] tracking-[0.04em] text-espresso/60">© {new Date().getFullYear()} The Enchanted Lane</p>
      </div>
    </footer>
  );
}
