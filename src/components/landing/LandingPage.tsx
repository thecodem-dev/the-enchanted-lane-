import { Header } from "./Header";
import { Hero } from "./Hero";
import { RouteSection } from "./RouteSection";
import { Features } from "./Features";
import { ClosingCTA } from "./ClosingCTA";
import { Footer } from "./Footer";

/**
 * The marketing landing page, served at "/". Every call to action boards the
 * train via goToBoard (see @/lib/navigation), which swaps to the intro screen
 * in place, no page reload.
 *
 * Imported from the former standalone enchanted-lane-landing project.
 */
export function LandingPage() {
  return (
    <div className="landing">
      <Header />
      <main>
        <Hero />
        <RouteSection />
        <Features />
        <ClosingCTA />
      </main>
      <Footer />
    </div>
  );
}
