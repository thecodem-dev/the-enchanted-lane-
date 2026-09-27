/**
 * Design tokens — single source of truth for the Antique Brass palette and typefaces.
 *
 * Matches the Enchanted Lane landing page so both surfaces read as one brand.
 * This is a LIGHT palette: dark espresso text on cream / tan surfaces.
 *
 * Contrast notes (WCAG, against cream #FAF4E0 / tan #D7CBB5):
 *   · espresso  13.1 / 9.0  — any text
 *   · muted      6.4 / 4.4  — secondary text
 *   · rust       5.8 / 3.9  — accent text on cream, CTA fills (cream text on rust = 5.8)
 *   · brass      4.2 / 2.9  — strokes, markers, borders, fills; not small text
 *   · sage       2.2 / 1.5  — dividers and decoration only; never text
 *
 * Usage:  import { PALETTE, FONTS } from '@/styles/tokens'
 */

// ── Palette ────────────────────────────────────────────────────
export const PALETTE = {
  /** Cream — page background */
  void:       '#FAF4E0',
  /** Tan — raised cards, sidebar, top bar */
  surface:    '#D7CBB5',
  /** Tan — raised panels */
  panel:      '#D7CBB5',
  /** Espresso — primary text */
  text:       '#3E2318',
  /** Brass — primary accent: markers, strokes, active states */
  gold:       '#917043',
  /** Rust — emphasis */
  goldBright: '#88523D',
  /** Sage — subdued decoration */
  goldDim:    '#A6A99A',
  /** Sage — muted accent, dividers */
  support:    '#A6A99A',
  /** Muted espresso — secondary text (sage fails contrast as text) */
  dim:        '#6B5444',
  /** Rust — CTAs, accent text, emphasis */
  rust:       '#88523D',
  /** Tan + 12% brass — card hover background */
  reveal:     '#CFC0A7',
  /** Cream — text on rust buttons */
  ink:        '#FAF4E0',
} as const

// ── Short aliases matching the single-letter names used throughout the codebase ──
/** @alias PALETTE.void */
export const V  = PALETTE.void
/** @alias PALETTE.surface */
export const S  = PALETTE.surface
/** @alias PALETTE.panel */
export const P  = PALETTE.panel
/** @alias PALETTE.text */
export const T  = PALETTE.text
/** @alias PALETTE.gold */
export const A  = PALETTE.gold
/** @alias PALETTE.goldBright */
export const AB = PALETTE.goldBright
/** @alias PALETTE.support */
export const G  = PALETTE.support
/** @alias PALETTE.dim */
export const D  = PALETTE.dim
/** @alias PALETTE.rust */
export const R  = PALETTE.rust
/** @alias PALETTE.reveal */
export const RV = PALETTE.reveal
/** @alias PALETTE.ink */
export const INK = PALETTE.ink

// ── Typefaces ──────────────────────────────────────────────────
export const FONTS = {
  /** Del Rose — hero / display moments only (single weight: always fontWeight 400) */
  display: "'Del Rose', Georgia, serif",
  text:    "'Poppins', system-ui, sans-serif",
  sans:    "'Poppins', system-ui, sans-serif",
  /** Labels and codes — formerly DM Mono; weight + letter-spacing now carry the label feel */
  mono:    "'Poppins', system-ui, sans-serif",
} as const

/** @alias FONTS.display */
export const DISPLAY = FONTS.display
/** @alias FONTS.text */
export const TEXT_F  = FONTS.text
/** @alias FONTS.sans */
export const SANS    = FONTS.sans
/** @alias FONTS.mono */
export const MONO    = FONTS.mono
