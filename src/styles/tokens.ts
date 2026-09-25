/**
 * Design tokens — single source of truth for the Blue Train palette and typefaces.
 *
 * Derived from the actual Blue Train livery and interior:
 *   · Royal cobalt blue steel carriages (since 1937)
 *   · Gold-dusted windows (real gold film to reduce heat/glare)
 *   · Ivory linen tablecloths and stationery
 *   · Polished brass stanchions at departure
 *   · Malachite green upholstery in the lounge cars
 *
 * Usage:  import { PALETTE, FONTS } from '@/styles/tokens'
 */

// ── Palette ────────────────────────────────────────────────────
export const PALETTE = {
  /** Night sky through gold-tinted glass */
  void:       '#0A0F1A',
  /** Cobalt carriage body / bulkhead panels */
  surface:    '#0F1E3A',
  /** Dining car wood panelling */
  panel:      '#162444',
  /** Ivory linen — tablecloths, notepaper */
  text:       '#F0E8D0',
  /** Polished brass + exterior chevrons */
  gold:       '#C9A84C',
  /** Highlighted gold trim */
  goldBright: '#E8C96A',
  /** Aged brass — subdued labels */
  goldDim:    '#7A6230',
  /** Malachite green — lounge upholstery */
  support:    '#4A7C6A',
  /** Steel blue — window frames, muted text */
  dim:        '#2A4A6A',
  /** Locomotive red — train marker */
  rust:       '#7A2E1A',
  /** Dark amber — hover background */
  reveal:     '#2C1A08',
  /** Lamp black — text on gold buttons */
  ink:        '#1A0E08',
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
  display: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
  text:    "'Crimson Pro', Georgia, serif",
  sans:    "'Libre Franklin', system-ui, sans-serif",
  mono:    "'DM Mono', 'Courier New', monospace",
} as const

/** @alias FONTS.display */
export const DISPLAY = FONTS.display
/** @alias FONTS.text */
export const TEXT_F  = FONTS.text
/** @alias FONTS.sans */
export const SANS    = FONTS.sans
/** @alias FONTS.mono */
export const MONO    = FONTS.mono
