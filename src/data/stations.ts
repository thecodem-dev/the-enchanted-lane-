import type { Language, Station } from '@/types'

/**
 * All nine stations in journey order (Pretoria → Cape Town).
 * SVG coordinates are hand-tuned to the simplified South Africa polygon.
 */
export const STATIONS: Station[] = [
  {
    id: 'pretoria',
    name: 'Pretoria',
    subtitle: 'Jacaranda City',
    num: 'I',
    x: 620, y: 180,
    lat: -25.7479, lng: 28.2293,
    terrain: 'highveld',
    heritage:
      "Founded in 1855, Pretoria is South Africa's administrative capital. Each October, over 70,000 jacaranda trees transform the city into a purple dreamscape — a spectacle so beloved it has become the city's defining identity. The Union Buildings, seat of government, survey it all from a ridge above the city.",
    gems: [
      'Melrose House — where the Treaty of Vereeniging ended the Anglo-Boer War',
      'Wonderboom Nature Reserve — a 1,000-year-old wild fig tree, one living being',
      'Pierneef Museum — treasures of South African landscape art',
    ],
    names: { en: 'Pretoria', zu: 'ePitoli', af: 'Pretoria', st: 'Pitori' },
  },
  {
    id: 'johannesburg',
    name: 'Johannesburg',
    subtitle: 'City of Gold',
    num: 'II',
    x: 596, y: 220,
    lat: -26.2041, lng: 28.0473,
    terrain: 'highveld',
    heritage:
      'Born from the 1886 gold rush on the Witwatersrand, Johannesburg rose from a surveyor\'s tent city to a metropolis of five million in barely a century — the fastest-growing city in recorded history at its founding. eGoli, place of gold, it was named with earned pride.',
    gems: [
      'Gold Reef City — descend 250 metres into a working mine shaft',
      "Constitution Hill — from apartheid prison to democracy's citadel",
      "Maboneng Precinct — Africa's most vibrant creative quarter",
    ],
    names: { en: 'Johannesburg', zu: 'eGoli', af: 'Johannesburg', st: 'Johanesboko' },
  },
  {
    id: 'klerksdorp',
    name: 'Klerksdorp',
    subtitle: 'Ancient Spheres',
    num: 'III',
    x: 532, y: 290,
    lat: -26.8521, lng: 26.6667,
    terrain: 'highveld',
    heritage:
      "One of South Africa's oldest European settlements, Klerksdorp sits at the edge of the Highveld. Nearby farms have yielded the Klerksdorp spheres — 2.8-billion-year-old grooved metallic objects that predate complex life on Earth. Their origin remains one of geology's most intriguing mysteries.",
    gems: [
      'Faan Meintjes Nature Reserve — black wildebeest and springbok',
      'Klerksdorp Museum — the ancient spheres, close enough to touch',
      'Goedgegun Dam — waterbirds and wind, the sound of the interior',
    ],
    names: { en: 'Klerksdorp', zu: 'Klerksdorp', af: 'Klerksdorp', st: 'Klerksdorp' },
  },
  {
    id: 'kimberley',
    name: 'Kimberley',
    subtitle: 'Diamond Capital',
    num: 'IV',
    x: 428, y: 358,
    lat: -28.7282, lng: 24.7499,
    terrain: 'karoo',
    heritage:
      "The Big Hole is the largest hand-dug excavation on Earth — 97 metres deep and 463 metres wide, carved by 50,000 miners between 1871 and 1914. From this pit came 2,722 kilograms of diamonds that rewrote South Africa's destiny and lured the ambitions of empire.",
    gems: [
      "The Big Hole & Kimberley Mine Museum — mankind's greatest pit, still open",
      'McGregor Museum — the full story of colonial ambition in the Northern Cape',
      "Rudd House — Cecil Rhodes's Kimberley residence, frozen in 1890",
    ],
    names: { en: 'Kimberley', zu: 'eKimberley', af: 'Kimberley', st: 'Kimbele' },
  },
  {
    id: 'de_aar',
    name: 'De Aar',
    subtitle: 'Heart of the Rails',
    num: 'V',
    x: 382, y: 432,
    lat: -30.649, lng: 24.0123,
    terrain: 'karoo',
    heritage:
      '"The Vein" — De Aar\'s Dutch name describes exactly what it is: the pulsing artery through which South Africa\'s rail network converges. At its steam-age peak, De Aar operated one of the largest locomotive workshops in the Southern Hemisphere — a cathedral of grease, iron, and ambition.',
    gems: [
      'SAR Locomotive Shed — heritage steam engines preserved in situ',
      "The Karoo sky — among the continent's darkest night skies, no horizon",
      'Vanderkloof Dam — 60 kilometres of shoreline and absolute silence',
    ],
    names: { en: 'De Aar', zu: 'De Aar', af: 'De Aar', st: 'De Aar' },
  },
  {
    id: 'beaufort_west',
    name: 'Beaufort West',
    subtitle: 'Karoo Gateway',
    num: 'VI',
    x: 298, y: 496,
    lat: -32.3567, lng: 22.583,
    terrain: 'karoo',
    heritage:
      "The oldest town in the Great Karoo, Beaufort West is the birthplace of Christiaan Barnard, who performed the world's first successful heart transplant in 1967. The Karoo National Park begins at the town's doorstep — a prehistoric landscape of fossils, flat-topped koppies, and geological time made visible.",
    gems: [
      'Karoo National Park — Cape mountain zebra, aardwolf, and caracal',
      'Schreiner House — birthplace of novelist Olive Schreiner',
      'Nuweveld Plateau — Triassic and Jurassic fossils locked in ancient shale',
    ],
    names: { en: 'Beaufort West', zu: 'Beaufort West', af: 'Beaufort-Wes', st: 'Beaufort-Wes' },
  },
  {
    id: 'matjiesfontein',
    name: 'Matjiesfontein',
    subtitle: 'Frozen in Time',
    num: 'VII',
    x: 210, y: 534,
    lat: -33.2307, lng: 20.583,
    terrain: 'karoo',
    heritage:
      "South Africa's most perfectly preserved Victorian village — a National Monument where time stopped in 1884. Founded by Scottish immigrant James Douglas Logan, every original building stands. A single red London double-decker bus serves as the town taxi. The Lord Milner Hotel has operated unchanged for 140 years.",
    gems: [
      'Lord Milner Hotel — colonial grandeur, utterly unchanged since 1884',
      "Logan's Cottage Museum — the full Victorian story told in miniature",
      'The station platform under Karoo stars — the greatest free theatre in Africa',
    ],
    names: {
      en: 'Matjiesfontein',
      zu: 'Matjiesfontein',
      af: 'Matjiesfontein',
      st: 'Matjiesfontein',
    },
  },
  {
    id: 'worcester',
    name: 'Worcester',
    subtitle: 'Valley of Vineyards',
    num: 'VIII',
    x: 152, y: 554,
    lat: -33.6465, lng: 19.4485,
    terrain: 'winelands',
    heritage:
      "Worcester presides over the Breede River Valley, cradled by the Hex River Mountains whose peaks carry snow each winter. South Africa's largest wine grape producing valley, the region blends pastoral grandeur with a living Cape Colony tradition that stretches back to the earliest settlers.",
    gems: [
      'Hex River Valley — snow-capped peaks above the table grape farms',
      'Kleinplasie Open Air Museum — brandy distilling and rusk-baking, live',
      "Bain's Kloof Pass — one of the finest mountain passes in Africa",
    ],
    names: { en: 'Worcester', zu: 'Worcester', af: 'Worcester', st: 'Worcester' },
  },
  {
    id: 'cape_town',
    name: 'Cape Town',
    subtitle: 'Mother City',
    num: 'IX',
    x: 104, y: 566,
    lat: -33.9249, lng: 18.4241,
    terrain: 'cape',
    heritage:
      'Founded by the Dutch East India Company in 1652, Cape Town is Africa\'s oldest colonial city. Table Mountain — one of the Seven Natural Wonders of the World — watches over a city of extraordinary diversity and resilience. Your journey ends here. The story of the Cape is only beginning.',
    gems: [
      'Bo-Kaap — painted houses and 400 years of Cape Malay heritage',
      "Boulders Beach, Simon's Town — African penguins at arm's reach",
      'Signal Hill at sunset — the whole bay ablaze, every evening, free',
    ],
    names: { en: 'Cape Town', zu: 'iKapa', af: 'Kaapstad', st: 'Motse wa Kapa' },
  },
]

/** Language picker options */
export const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'Continue' },
  { code: 'zu', label: 'isiZulu', native: 'Qhubeka' },
  { code: 'af', label: 'Afrikaans', native: 'Voortgaan' },
  { code: 'st', label: 'Sesotho', native: 'Tswela pele' },
]

/** Conductor greeting shown on the intro screen per language */
export const CONDUCTOR_GREETING: Record<Language, string> = {
  en: 'Good evening, passengers. Your conductor speaks English.',
  zu: 'Sawubona, izidluli. Umlayeli wenu ukhuluma isiZulu.',
  af: 'Goeie aand, passasiers. U geleier praat Afrikaans.',
  st: 'Dumelang, baeti. Motsamaisi wa hao o bua Sesotho.',
}

/**
 * SVG polygon points for the South Africa outline used in the legacy SVG map.
 */
export const SA_POLY_POINTS =
  '90,50 500,45 800,48 858,162 858,285 838,358 818,425 776,472 726,510 682,542 636,560 586,570 528,576 472,578 414,574 388,577 328,558 278,546 230,540 188,548 148,552 118,562 96,548 75,508 55,428 38,340 18,295 42,210 90,50'

/**
 * Polygon point strings for terrain tint overlays.
 */
export const TERRAIN_AREAS = {
  karoo: '382,432 428,358 350,350 280,390 250,450 298,496 382,432',
  highveld: '532,290 596,220 620,180 660,185 680,250 640,310 560,320 532,290',
}
