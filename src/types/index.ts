/** Supported UI languages */
export type Language = 'en' | 'zu' | 'af' | 'st'

/** App phase — landing page, sign-in, intro splash, or the main journey */
export type Phase = 'landing' | 'sign-in' | 'intro' | 'journey'

/** A single stop on the route, with localised names and content */
export interface Station {
  id: string
  name: string
  subtitle: string
  /** Roman numeral chapter number (I–IX) */
  num: string
  /** SVG x coordinate on the map (viewBox 0–870) */
  x: number
  /** SVG y coordinate on the map (viewBox 0–870) */
  y: number
  lat: number
  lng: number
  heritage: string
  gems: string[]
  names: Record<Language, string>
  terrain: string
}
