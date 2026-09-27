/**
 * Station video data — one heritage clip per station.
 *
 * A station plays either a local file (`src`, imported from src/assets/videos)
 * or a YouTube clip (`videoId`). `src` wins when both are set.
 * The key must match the station id in stations.ts.
 */
import pretoriaDocumentary from '@/assets/videos/pretoria-documentary.mp4'

export interface StationVideo {
  title: string
  /** Local video file — played in-app with the browser's own player */
  src?: string
  /** YouTube video id — played in an embedded YouTube player */
  videoId?: string
}

export const STATION_VIDEOS: Record<string, StationVideo> = {
  pretoria:       { src: pretoriaDocumentary, title: 'Pretoria — Jacaranda City' },
  johannesburg:   { videoId: 'LBn4mM7sIgI', title: 'Johannesburg — City of Gold'     },
  klerksdorp:     { videoId: 'dQw4w9WgXcQ', title: 'Klerksdorp — Ancient Spheres'    },
  kimberley:      { videoId: 'dQw4w9WgXcQ', title: 'Kimberley — Diamond Capital'     },
  de_aar:         { videoId: 'dQw4w9WgXcQ', title: 'De Aar — Heart of the Rails'     },
  beaufort_west:  { videoId: 'dQw4w9WgXcQ', title: 'Beaufort West — Karoo Gateway'   },
  matjiesfontein: { videoId: 'dQw4w9WgXcQ', title: 'Matjiesfontein — Frozen in Time' },
  worcester:      { videoId: 'dQw4w9WgXcQ', title: 'Worcester — Valley of Vineyards' },
  cape_town:      { videoId: 'CZXLMmvIJpU', title: 'Cape Town — Mother City'         },
}
