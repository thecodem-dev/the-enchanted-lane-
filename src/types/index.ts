/** Supported UI languages */
export type Language = 'en' | 'zu' | 'af' | 'st'

/** App phase — landing page, sign-in, intro splash, or the main journey */
export type Phase = 'landing' | 'sign-in' | 'intro' | 'journey'

/** A single quiz question tied to a station */
export interface QuizQuestion {
  id: string
  /** Station id this question belongs to — only shown once that station is awoken */
  stationId: string
  question: string
  options: [string, string, string, string]
  /** Index (0–3) of the correct option */
  correctIndex: number
  /** Shown after answering — source from station heritage/gems */
  explanation: string
}

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
