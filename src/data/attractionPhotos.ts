/**
 * attractionPhotos.ts — photos for Hidden Gems, keyed by attraction id.
 *
 * Drop a photo into src/assets/photos/ named after the attraction's id
 * (e.g. union-buildings.jpg) and it is picked up automatically. Files whose
 * names differ from the id are mapped in FILE_TO_ATTRACTION below.
 */

const files = import.meta.glob<string>('../assets/photos/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})

/** Photo filename (without extension) → attraction id, where they differ */
const FILE_TO_ATTRACTION: Record<string, string> = {
  'ditsong-museum':     'ditsong-pretoria',
  'hector-museum':      'hector-pieterson',
  'soweto-township':    'soweto-township-experience',
  'joburg-art-gallery': 'johannesburg-art-gallery',
  'faan-meintjes':      'faan-meintjes-nature-reserve',
  'kimberly-hole':      'big-hole',
  'de-aar-railway':     'de-aar-railway-museum',
  'beaufort-west':      'beaufort-west-museum',
  'karoo-national':     'karoo-national-park',
  'lord-milner':        'lord-milner-hotel',
  'worcester-museum':   'worcester-art-museum',
  'iziko-lodge':        'iziko-slave-lodge',
}

export const ATTRACTION_PHOTOS: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => {
    const name = path.split('/').pop()!.replace(/\.[^.]+$/, '')
    return [FILE_TO_ATTRACTION[name] ?? name, url]
  }),
)
