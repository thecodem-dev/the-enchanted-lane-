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
  johannesburg:   { videoId: '0VXlI9cqXAA', title: 'Johannesburg — City of Gold'     },
  klerksdorp:     { videoId: 'vlxsCcK-D_8', title: 'Klerksdorp — Ancient Spheres'    },
  kimberley:      { videoId: 'Qg8iJF0-0F8', title: 'Kimberley — Diamond Capital'     },
  de_aar:         { videoId: 'nVj9j9FeHsI', title: 'De Aar — Heart of the Rails'     },
  beaufort_west:  { videoId: 'gpzw9bQgm6k', title: 'Beaufort West — Karoo Gateway'   },
  matjiesfontein: { videoId: 'CE4QzbuUB0I', title: 'Matjiesfontein — Frozen in Time' },
  worcester:      { videoId: 'Ex4tKjt2ClE', title: 'Worcester — Valley of Vineyards' },
  cape_town:      { videoId: 'Py4NpNQq9_w', title: 'Cape Town — Mother City'         },
}
