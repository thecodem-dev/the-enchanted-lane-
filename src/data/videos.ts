/**
 * Station video data — one heritage clip per station.
 *
 * Replace `videoId` values with real YouTube IDs for ~5-minute heritage clips.
 * The id must match the station id in stations.ts.
 */
export interface StationVideo {
  videoId: string
  title: string
}

export const STATION_VIDEOS: Record<string, StationVideo> = {
  pretoria:       { videoId: 'Hv6EMd8dlQk', title: 'Pretoria — Jacaranda City'       },
  johannesburg:   { videoId: 'LBn4mM7sIgI', title: 'Johannesburg — City of Gold'     },
  klerksdorp:     { videoId: 'dQw4w9WgXcQ', title: 'Klerksdorp — Ancient Spheres'    },
  kimberley:      { videoId: 'dQw4w9WgXcQ', title: 'Kimberley — Diamond Capital'     },
  de_aar:         { videoId: 'dQw4w9WgXcQ', title: 'De Aar — Heart of the Rails'     },
  beaufort_west:  { videoId: 'dQw4w9WgXcQ', title: 'Beaufort West — Karoo Gateway'   },
  matjiesfontein: { videoId: 'dQw4w9WgXcQ', title: 'Matjiesfontein — Frozen in Time' },
  worcester:      { videoId: 'dQw4w9WgXcQ', title: 'Worcester — Valley of Vineyards' },
  cape_town:      { videoId: 'CZXLMmvIJpU', title: 'Cape Town — Mother City'         },
}
