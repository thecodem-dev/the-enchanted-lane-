/**
 * Cultural and educational tourist attractions per station.
 *
 * Budget tiers (per person, ZAR):
 *   budget  — R0–R150   (free or very affordable)
 *   mid     — R151–R500
 *   premium — R501+
 *
 * Categories reflect the cultural/educational focus of the app.
 */

export type BudgetTier = 'budget' | 'mid' | 'premium'
export type AttractionCategory =
  | 'history'
  | 'museum'
  | 'nature'
  | 'heritage'
  | 'arts'
  | 'science'
  | 'township'
  | 'architecture'

export interface Attraction {
  id: string
  stationId: string
  name: string
  tagline: string
  description: string
  category: AttractionCategory
  budget: BudgetTier
  /** Approximate cost in ZAR per adult. 0 = free. */
  priceZAR: number
  duration: string
  highlights: string[]
  educationalFocus: string
  bookingInfo: {
    available: boolean
    method: string
    contact: string
    url?: string | undefined
  }
  openingHours: string
  address: string
}

export const ATTRACTIONS: Attraction[] = [

  // ── PRETORIA ─────────────────────────────────────────────────

  {
    id: 'union-buildings',
    stationId: 'pretoria',
    name: 'Union Buildings & Gardens',
    tagline: 'The seat of South African democracy',
    description:
      'Designed by Herbert Baker and completed in 1913, the Union Buildings are the official seat of the South African government. The terraced gardens offer panoramic views of Pretoria and host the iconic Nelson Mandela statue. A living symbol of the country\'s constitutional journey.',
    category: 'architecture',
    budget: 'budget',
    priceZAR: 0,
    duration: '1–2 hours',
    highlights: [
      'Herbert Baker\'s Edwardian sandstone architecture',
      'Nelson Mandela bronze statue (9 metres tall)',
      'Terraced Italianate gardens with city views',
      'Site of Mandela\'s 1994 presidential inauguration',
    ],
    educationalFocus: 'Constitutional history, colonial architecture, democratic transition',
    bookingInfo: {
      available: false,
      method: 'Walk-in (gardens only; interior by appointment)',
      contact: '+27 12 300 5200',
    },
    openingHours: 'Gardens: 7am–6pm daily',
    address: 'Government Ave, Arcadia, Pretoria',
  },
  {
    id: 'voortrekker-monument',
    stationId: 'pretoria',
    name: 'Voortrekker Monument & Museum',
    tagline: 'The Great Trek carved in stone and history',
    description:
      'A UNESCO World Heritage Site and one of South Africa\'s most significant cultural landmarks. The monument commemorates the Voortrekkers who left the Cape Colony in the 1830s. The interior frieze — 27 marble panels — narrates the Great Trek in extraordinary detail.',
    category: 'heritage',
    budget: 'budget',
    priceZAR: 120,
    duration: '2–3 hours',
    highlights: [
      '27-panel marble frieze — the world\'s largest historical tapestry in stone',
      'Cenotaph lit by sunlight at noon on 16 December each year',
      'Museum covering Voortrekker history and the Battle of Blood River',
      'Nature reserve with walking trails on the grounds',
    ],
    educationalFocus: 'Afrikaner history, 19th-century migration, colonial-era South Africa',
    bookingInfo: {
      available: true,
      method: 'Online or walk-in',
      contact: '+27 12 326 6770',
      url: 'https://www.voortrekkermon.org.za',
    },
    openingHours: 'Mon–Sun 8am–5pm',
    address: 'Eeufees Rd, Groenkloof, Pretoria',
  },
  {
    id: 'freedom-park',
    stationId: 'pretoria',
    name: 'Freedom Park',
    tagline: 'A sanctuary for memory, healing and reconciliation',
    description:
      'Freedom Park honours all who died in the conflicts that shaped South Africa — from pre-colonial times through apartheid. The Isivivane (resting place of the spirits) and the Wall of Names are profoundly moving. Designed by prominent South African architects, the park integrates indigenous symbolism throughout.',
    category: 'heritage',
    budget: 'budget',
    priceZAR: 80,
    duration: '2–3 hours',
    highlights: [
      'Wall of Names — 75,000 names of those who died for freedom',
      'Isivivane — sacred space honouring fallen soldiers',
      'Sikhumbuto — eternal flame memorial',
      'Panoramic views of Pretoria and the Magaliesberg',
    ],
    educationalFocus: 'Post-apartheid reconciliation, conflict memory, indigenous spirituality',
    bookingInfo: {
      available: true,
      method: 'Online booking or at the gate',
      contact: '+27 12 470 7400',
      url: 'https://www.freedompark.co.za',
    },
    openingHours: 'Tue–Sun 8am–5pm',
    address: 'Koch St, Salvokop, Pretoria',
  },
  {
    id: 'ditsong-pretoria',
    stationId: 'pretoria',
    name: 'Ditsong National Museum of Natural History',
    tagline: 'Three billion years of Earth\'s story under one roof',
    description:
      'One of Africa\'s great natural history museums, housing extensive palaeontological, geological, and zoological collections. The fossil collection includes specimens from the Cradle of Humankind. An essential stop for understanding how the African subcontinent was formed.',
    category: 'science',
    budget: 'budget',
    priceZAR: 90,
    duration: '2–3 hours',
    highlights: [
      'Karoo fossil collection — Permian and Triassic prehistoric fauna',
      'Cradle of Humankind hominin casts and artefacts',
      'Geological timeline of southern Africa',
      'Victorian-era building with original display cases',
    ],
    educationalFocus: 'Palaeontology, geology, natural history, human evolution',
    bookingInfo: {
      available: true,
      method: 'Walk-in or group bookings by phone',
      contact: '+27 12 322 7632',
      url: 'https://www.ditsong.org.za',
    },
    openingHours: 'Mon–Fri 8am–4pm, Sat–Sun 8am–4pm',
    address: 'Paul Kruger St, Pretoria CBD',
  },

  // ── JOHANNESBURG ─────────────────────────────────────────────

  {
    id: 'apartheid-museum',
    stationId: 'johannesburg',
    name: 'Apartheid Museum',
    tagline: 'The definitive account of apartheid and its defeat',
    description:
      'Widely regarded as one of the world\'s greatest museums, the Apartheid Museum tells the story of the rise and fall of apartheid through film, text, and artefacts. Visitors enter through "White" or "Non-White" gates — immediately experiencing the dehumanising classification system. Essential for understanding modern South Africa.',
    category: 'history',
    budget: 'mid',
    priceZAR: 180,
    duration: '3–4 hours',
    highlights: [
      'Classification entrance — gates based on randomly assigned racial tickets',
      'Pillars of the Constitution — 10 pillars each bearing a Bill of Rights right',
      'Original film footage of apartheid-era events',
      'Mandela exhibition and the story of the ANC',
    ],
    educationalFocus: 'Apartheid history, human rights, constitutional democracy, resistance',
    bookingInfo: {
      available: true,
      method: 'Online or walk-in',
      contact: '+27 11 309 4700',
      url: 'https://www.apartheidmuseum.org',
    },
    openingHours: 'Tue–Sun 9am–5pm',
    address: 'Northern Pkwy & Gold Reef Rd, Johannesburg',
  },
  {
    id: 'constitution-hill',
    stationId: 'johannesburg',
    name: 'Constitution Hill',
    tagline: 'From apartheid prison to the home of the Constitutional Court',
    description:
      'A former prison complex that held Nelson Mandela, Mahatma Gandhi, and Winnie Mandela — now home to South Africa\'s Constitutional Court. The contrast between the brutality of the old prison and the democratic ideals of the court is one of the most powerful architectural statements in the country.',
    category: 'history',
    budget: 'mid',
    priceZAR: 150,
    duration: '2–3 hours',
    highlights: [
      'Number Four — the notorious section for Black prisoners',
      'Women\'s Gaol where Winnie Mandela was held',
      'Constitutional Court with indigenous artworks integrated into its design',
      'Guided tours by former political prisoners',
    ],
    educationalFocus: 'Human rights, constitutional law, apartheid-era detention, democracy',
    bookingInfo: {
      available: true,
      method: 'Online or walk-in',
      contact: '+27 11 381 3100',
      url: 'https://www.constitutionhill.org.za',
    },
    openingHours: 'Mon–Sun 9am–5pm',
    address: '1 Hospital St, Braamfontein, Johannesburg',
  },
  {
    id: 'hector-pieterson',
    stationId: 'johannesburg',
    name: 'Hector Pieterson Museum — Soweto',
    tagline: 'Where the June 16 uprising changed history',
    description:
      'Built near the spot where 12-year-old Hector Pieterson was shot during the 1976 Soweto uprising, this museum documents the student revolt against Afrikaans as a medium of instruction. The iconic photograph by Sam Nzima — of Hector being carried by Mbuyisa Makhubo — is the centrepiece of a moving exhibit.',
    category: 'history',
    budget: 'budget',
    priceZAR: 80,
    duration: '1.5–2 hours',
    highlights: [
      'Sam Nzima\'s iconic 1976 photograph and the story behind it',
      'Student voices — oral history recordings of survivors',
      'The uprising timeline and its global impact',
      'Adjacent memorial at the site of the shooting',
    ],
    educationalFocus: 'Youth resistance, Soweto uprising, language rights, liberation history',
    bookingInfo: {
      available: true,
      method: 'Walk-in; guided Soweto tours available',
      contact: '+27 11 536 0611',
    },
    openingHours: 'Mon–Sun 10am–5pm',
    address: 'Khumalo St, Orlando West, Soweto',
  },
  {
    id: 'origins-centre',
    stationId: 'johannesburg',
    name: 'Origins Centre — Wits University',
    tagline: '100,000 years of African humanity',
    description:
      'Africa\'s leading museum of human origins, housed at the University of the Witwatersrand. The Origins Centre explores the archaeology, rock art, and genetics of modern humans — tracing the story of humanity from its African birthplace. The San rock art collection is one of the finest in the world.',
    category: 'science',
    budget: 'mid',
    priceZAR: 120,
    duration: '2 hours',
    highlights: [
      'San rock art — ancient paintings explained in cultural context',
      'Human genome story — genetic evidence for African origins',
      'Fossil replicas from Sterkfontein and other SA sites',
      'Interactive exhibits on cognitive evolution',
    ],
    educationalFocus: 'Human evolution, indigenous culture, San heritage, archaeology',
    bookingInfo: {
      available: true,
      method: 'Walk-in or group bookings',
      contact: '+27 11 717 4700',
      url: 'https://www.origins.org.za',
    },
    openingHours: 'Mon–Sat 9am–4pm',
    address: 'Yale Rd, Braamfontein (Wits University), Johannesburg',
  },
  {
    id: 'soweto-township-experience',
    stationId: 'johannesburg',
    name: 'Soweto Heritage & Township Tour',
    tagline: 'The cradle of the anti-apartheid movement',
    description:
      'Soweto — South Western Townships — is the most historically significant urban community in South Africa. Home to both Nelson Mandela and Desmond Tutu (the only street in the world to have housed two Nobel Peace Prize laureates), it was the epicentre of the 1976 Soweto Uprising. A guided heritage tour covers Vilakazi Street, the Hector Pieterson Memorial, and the living neighbourhoods of Orlando West and Kliptown.',
    category: 'township',
    budget: 'mid',
    priceZAR: 350,
    duration: '4–5 hours',
    highlights: [
      'Vilakazi Street — Mandela and Tutu\'s neighbourhood, now a living museum',
      'Regina Mundi Church — bullet holes still visible from the 1976 uprising',
      'Kliptown — Freedom Charter signing site (26 June 1955)',
      'Orlando Towers — iconic cooling towers transformed into an urban arts landmark',
    ],
    educationalFocus: 'Soweto Uprising 1976, anti-apartheid movement, township life, Freedom Charter',
    bookingInfo: {
      available: true,
      method: 'Book via Soweto Hotels or local tour operators',
      contact: '+27 11 938 3537',
      url: 'https://www.soweto.co.za',
    },
    openingHours: 'Tours depart daily from Johannesburg city centre; times vary by operator',
    address: 'Vilakazi St, Orlando West, Soweto, Johannesburg',
  },
  {
    id: 'johannesburg-art-gallery',
    stationId: 'johannesburg',
    name: 'Johannesburg Art Gallery (JAG)',
    tagline: 'The largest art collection in sub-Saharan Africa',
    description:
      'Founded in 1910 and housed in a Herbert Baker–designed building in Joubert Park, JAG holds over 10,000 works spanning South African, Dutch, Flemish, French, British, and contemporary African art. The collection documents the full arc of South African visual culture — from 17th-century Dutch masters to contemporary black South African artists reclaiming their narrative. Entry is free.',
    category: 'arts',
    budget: 'budget',
    priceZAR: 0,
    duration: '1.5–2.5 hours',
    highlights: [
      'South African art spanning three centuries — the most comprehensive collection anywhere',
      'Works by Gerard Sekoto, Irma Stern, and Walter Battiss',
      'African traditional art and beadwork collection',
      'Herbert Baker Edwardian building with original neoclassical interiors',
    ],
    educationalFocus: 'South African art history, colonial visual culture, contemporary African art',
    bookingInfo: {
      available: false,
      method: 'Walk-in; free entry',
      contact: '+27 11 725 3130',
    },
    openingHours: 'Tue–Sun 10am–5pm (closed Mon)',
    address: 'King George St, Joubert Park, Johannesburg',
  },

  // ── KLERKSDORP ────────────────────────────────────────────────

  {
    id: 'klerksdorp-museum',
    stationId: 'klerksdorp',
    name: 'Klerksdorp Museum & the Ancient Spheres',
    tagline: 'Touch objects older than complex life on Earth',
    description:
      'The Klerksdorp Museum holds one of the most enigmatic collections in South Africa — the Klerksdorp spheres, grooved metallic objects discovered in Precambrian pyrophyllite deposits dating to 2.8 billion years ago. Alongside the spheres, the museum documents the history of the region from early San hunter-gatherers through the Tswana kingdoms and the arrival of Voortrekker settlers. An intimate, genuinely surprising local museum.',
    category: 'museum',
    budget: 'budget',
    priceZAR: 30,
    duration: '1–1.5 hours',
    highlights: [
      'Klerksdorp spheres — 2.8-billion-year-old grooved objects, origin still debated',
      'San hunter-gatherer artefacts from the greater Mooi River valley',
      'Tswana cultural heritage — tools, ornaments, and oral tradition records',
      'Voortrekker and Anglo-Boer War history of the North West Province',
    ],
    educationalFocus: 'Precambrian geology, San history, Tswana heritage, frontier history',
    bookingInfo: {
      available: false,
      method: 'Walk-in; group bookings by phone',
      contact: '+27 18 462 2911',
    },
    openingHours: 'Mon–Fri 8am–4pm, Sat 9am–1pm',
    address: 'Lombard St, Klerksdorp, North West Province',
  },
  {
    id: 'faan-meintjes-nature-reserve',
    stationId: 'klerksdorp',
    name: 'Faan Meintjes Nature Reserve',
    tagline: 'Black wildebeest, springbok, and the silence of the Highveld',
    description:
      'One of the few nature reserves in the North West Province accessible directly from a small city, Faan Meintjes protects a typical Highveld grassland ecosystem. Black wildebeest, springbok, blesbok, and zebra roam freely. The reserve is managed for conservation and education, offering self-guided game drives and walking trails that interpret the ecology of South Africa\'s interior plateau.',
    category: 'nature',
    budget: 'budget',
    priceZAR: 40,
    duration: '2–3 hours',
    highlights: [
      'Black wildebeest and springbok in their natural Highveld habitat',
      'Self-guided game drive through open grassland',
      'Bird hide overlooking a seasonal wetland',
      'Educational trail boards explaining Highveld ecology and geology',
    ],
    educationalFocus: 'Highveld ecology, grassland conservation, South African fauna, geology',
    bookingInfo: {
      available: false,
      method: 'Walk-in; entrance fee at gate',
      contact: '+27 18 462 8931',
    },
    openingHours: 'Daily 7am–5pm',
    address: 'R53, Klerksdorp, North West Province',
  },

  // ── KIMBERLEY ─────────────────────────────────────────────────

  {
    id: 'big-hole',
    stationId: 'kimberley',
    name: 'The Big Hole & Kimberley Mine Museum',
    tagline: 'The world\'s largest hand-dug excavation',
    description:
      'The Big Hole — 463 metres wide and 240 metres deep — was dug entirely by hand between 1871 and 1914 by 50,000 miners seeking diamonds. The adjacent open-air museum preserves 40 original buildings from the diamond rush era. The viewing platform over the hole offers a genuinely staggering perspective on human ambition and labour.',
    category: 'heritage',
    budget: 'mid',
    priceZAR: 200,
    duration: '2–3 hours',
    highlights: [
      'Viewing platform directly over the 240-metre deep hole',
      'The 616-carat Eureka Diamond — first diamond found in South Africa',
      '40 original Victorian buildings reconstructed on site',
      'Working tram through the historical village',
    ],
    educationalFocus: 'Mining history, colonial economics, labour history, geology',
    bookingInfo: {
      available: true,
      method: 'Online or walk-in',
      contact: '+27 53 839 4600',
      url: 'https://www.thebighole.co.za',
    },
    openingHours: 'Mon–Sun 8am–5pm',
    address: 'Tucker St, Kimberley',
  },
  {
    id: 'mcgregor-museum',
    stationId: 'kimberley',
    name: 'McGregor Museum',
    tagline: 'The Northern Cape\'s premier cultural institution',
    description:
      'Housed in a building that Cecil Rhodes used as his personal quarters during the Siege of Kimberley (1899–1900), the McGregor Museum covers the natural and cultural history of the Northern Cape. Exceptional collections on San rock art, the Anglo-Boer War, and the geological history of the diamond fields.',
    category: 'museum',
    budget: 'budget',
    priceZAR: 60,
    duration: '1.5–2 hours',
    highlights: [
      'Cecil Rhodes\' personal rooms, preserved as they were during the siege',
      'San rock art originals and interpretive displays',
      'Anglo-Boer War siege exhibits and artefacts',
      'Geology gallery — formation of the Kimberley diamond pipes',
    ],
    educationalFocus: 'Colonial history, indigenous San culture, Anglo-Boer War, geology',
    bookingInfo: {
      available: false,
      method: 'Walk-in',
      contact: '+27 53 839 2700',
    },
    openingHours: 'Mon–Sat 9am–5pm, Sun 2pm–5pm',
    address: 'Chapel St, Kimberley',
  },

  // ── DE AAR ─────────────────────────────────────────────────────

  {
    id: 'de-aar-railway-museum',
    stationId: 'de_aar',
    name: 'De Aar Railway Heritage Museum',
    tagline: 'The beating heart of South Africa\'s rail network',
    description:
      'De Aar was once the largest locomotive repair depot in the Southern Hemisphere. The heritage museum preserves steam locomotives, workshop equipment, and the stories of the workers who kept the nation\'s rail network running. An authentic window into South Africa\'s industrial and labour history.',
    category: 'heritage',
    budget: 'budget',
    priceZAR: 50,
    duration: '1.5 hours',
    highlights: [
      'Steam locomotives from the SAR Class 25 and 25NC eras',
      'Original workshop machinery in situ',
      'Photographs and oral histories of railway workers',
      'The iconic De Aar junction — still one of SA\'s busiest rail crossings',
    ],
    educationalFocus: 'Industrial heritage, labour history, railway technology, apartheid-era infrastructure',
    bookingInfo: {
      available: false,
      method: 'Walk-in; contact museum for group tours',
      contact: '+27 53 631 0111',
    },
    openingHours: 'Mon–Fri 9am–4pm',
    address: 'Station Rd, De Aar, Northern Cape',
  },

  // ── BEAUFORT WEST ─────────────────────────────────────────────

  {
    id: 'beaufort-west-museum',
    stationId: 'beaufort_west',
    name: 'Beaufort West Museum',
    tagline: 'Birthplace of a heart surgeon who changed the world',
    description:
      'The Beaufort West Museum chronicles the history of the oldest town in the Great Karoo. The Dr Christiaan Barnard Room is devoted to the Nobel-nominated surgeon who performed the world\'s first successful heart transplant at Groote Schuur Hospital in 1967 — born and schooled in this quiet Karoo town.',
    category: 'history',
    budget: 'budget',
    priceZAR: 30,
    duration: '1 hour',
    highlights: [
      'Christiaan Barnard\'s childhood artefacts and medical legacy',
      'Karoo history — indigenous Khoi-San, frontier settlers, railway',
      'Display on the first heart transplant (3 December 1967)',
      'Original Victorian building with period furnishings',
    ],
    educationalFocus: 'Medical history, Karoo settlement, Khoisan heritage, biography',
    bookingInfo: {
      available: false,
      method: 'Walk-in',
      contact: '+27 23 415 1000',
    },
    openingHours: 'Mon–Fri 8am–1pm, 2pm–4:30pm',
    address: 'Donkin St, Beaufort West',
  },
  {
    id: 'karoo-national-park',
    stationId: 'beaufort_west',
    name: 'Karoo National Park',
    tagline: 'Ancient landscape, living fossils, unforgettable silence',
    description:
      'The Karoo National Park protects a vast semi-arid landscape that is among the richest fossil sites on Earth. Triassic and Jurassic fossils — some 200–250 million years old — erode naturally from the shale. The park hosts Cape mountain zebra, black rhino, caracal, and hundreds of bird species. The fossil trail is a structured educational walk.',
    category: 'nature',
    budget: 'mid',
    priceZAR: 232,
    duration: 'Half day to full day',
    highlights: [
      'Fossil Trail — self-guided walk through 225-million-year-old geology',
      'Cape mountain zebra — endangered species recovering here',
      'Night sky experience — one of SA\'s darkest skies',
      'San rock engravings on the Nuweveld Plateau',
    ],
    educationalFocus: 'Palaeontology, conservation biology, Karoo geology, indigenous rock art',
    bookingInfo: {
      available: true,
      method: 'SANParks online booking (accommodation) or walk-in for day visits',
      contact: '+27 23 415 2828',
      url: 'https://www.sanparks.org/parks/karoo',
    },
    openingHours: 'Daily 7am–7pm (gate); 24hr for overnight guests',
    address: 'R381, Beaufort West',
  },

  // ── MATJIESFONTEIN ────────────────────────────────────────────

  {
    id: 'lord-milner-hotel',
    stationId: 'matjiesfontein',
    name: 'Lord Milner Hotel & Historical Village',
    tagline: 'South Africa\'s most perfectly preserved Victorian village',
    description:
      'Matjiesfontein is a National Monument — a village that has been frozen in 1884 since Scottish immigrant James Douglas Logan built it as a refreshment stop on the Cape-Johannesburg railway. The Lord Milner Hotel has never meaningfully changed. A red London double-decker bus still serves as the town taxi. The village is entirely walkable and entirely authentic.',
    category: 'heritage',
    budget: 'mid',
    priceZAR: 0,
    duration: '2–4 hours',
    highlights: [
      'Lord Milner Hotel — colonial grandeur unchanged for 140 years',
      'Marie Rawdon Museum — curiosities and colonial artefacts',
      'The original station platform — still used by trains',
      'The Transport Museum with vintage vehicles',
    ],
    educationalFocus: 'Victorian railway history, colonial social life, architectural preservation',
    bookingInfo: {
      available: true,
      method: 'Hotel bookings via phone or email; village walk-in free',
      contact: '+27 23 561 3011',
      url: 'https://www.lordmilner.com',
    },
    openingHours: 'Village: open at all times; hotel check-in from 2pm',
    address: 'Logan\'s Way, Matjiesfontein, Western Cape',
  },

  // ── WORCESTER ─────────────────────────────────────────────────

  {
    id: 'kleinplasie-museum',
    stationId: 'worcester',
    name: 'Kleinplasie Open Air Museum',
    tagline: 'Cape Colony life, lived out loud',
    description:
      'A living history museum where costumed interpreters demonstrate the crafts, foods, and daily routines of Cape Colony settlers from the 17th to early 20th centuries. Watch rusk-baking in a wood-fired oven, brandy distilling, wagon-wheel making, and candle-dipping. One of South Africa\'s most immersive cultural experiences.',
    category: 'heritage',
    budget: 'budget',
    priceZAR: 90,
    duration: '2–3 hours',
    highlights: [
      'Live demonstrations of Cape brandy distilling',
      'Traditional rusk baking and vetkoek frying',
      'Original farm buildings from the 18th and 19th centuries',
      'Craft workshops — leatherwork, smithing, basket weaving',
    ],
    educationalFocus: 'Cape Colony history, Afrikaner food culture, settler crafts, agricultural heritage',
    bookingInfo: {
      available: false,
      method: 'Walk-in; group bookings by phone',
      contact: '+27 23 342 2225',
    },
    openingHours: 'Mon–Sat 9am–4:30pm',
    address: 'Baring St, Worcester',
  },
  {
    id: 'worcester-art-museum',
    stationId: 'worcester',
    name: 'Worcester Museum (Stofberggebou)',
    tagline: 'The Breede Valley\'s cultural archive',
    description:
      'The Worcester Museum houses extensive collections on the history of the Breede River Valley — from the earliest Khoi-San inhabitants through the Dutch and British colonial periods to the Afrikaner Republic era. The ethnographic collection includes rare San tools and ornaments alongside settler artefacts.',
    category: 'museum',
    budget: 'budget',
    priceZAR: 20,
    duration: '1 hour',
    highlights: [
      'Khoisan artefacts — among the most complete collections in the Western Cape',
      'VOC and British colonial administration documents',
      'Breede Valley agricultural history and wine culture',
      'Period rooms showing settler domestic life',
    ],
    educationalFocus: 'Khoisan history, VOC era, Boland farming culture, colonial administration',
    bookingInfo: {
      available: false,
      method: 'Walk-in',
      contact: '+27 23 342 2369',
    },
    openingHours: 'Mon–Fri 9am–4pm',
    address: '24 Baring St, Worcester',
  },

  // ── CAPE TOWN ────────────────────────────────────────────────

  {
    id: 'district-six-museum',
    stationId: 'cape_town',
    name: 'District Six Museum',
    tagline: 'A community erased — and remembered',
    description:
      'District Six was a vibrant inner-city community of 60,000 people forcibly removed under apartheid\'s Group Areas Act from 1968 to 1982. The museum preserves the memory of the community through photographs, oral histories, street signs, and a remarkable floor map that former residents annotate with their memories.',
    category: 'history',
    budget: 'budget',
    priceZAR: 60,
    duration: '1.5–2 hours',
    highlights: [
      'The floor map — annotated by former residents with their homes and memories',
      'Original street signs salvaged before demolition',
      'Oral history booths — voices of former residents',
      'Photographic archive of community life before removal',
    ],
    educationalFocus: 'Forced removals, Group Areas Act, community memory, urban apartheid',
    bookingInfo: {
      available: true,
      method: 'Walk-in; guided tours recommended — book by phone',
      contact: '+27 21 466 7200',
      url: 'https://www.districtsix.co.za',
    },
    openingHours: 'Mon–Sat 9am–4pm',
    address: '25A Buitenkant St, Cape Town',
  },
  {
    id: 'iziko-slave-lodge',
    stationId: 'cape_town',
    name: 'Iziko Slave Lodge',
    tagline: 'Cape Town\'s oldest colonial building — and its darkest story',
    description:
      'Built in 1679 by the Dutch East India Company, the Slave Lodge housed up to 1,000 enslaved people from Madagascar, India, Indonesia, and East Africa. It is now a museum exploring the history of slavery at the Cape — one of the most significant but least-known chapters in South African history.',
    category: 'history',
    budget: 'budget',
    priceZAR: 50,
    duration: '1.5 hours',
    highlights: [
      'The untold story of Cape slavery — 1652 to 1838',
      'Artefacts and documents from the VOC slave trade',
      'Egyptian and Roman antiquities collection (Iziko collection)',
      'Building itself — oldest extant colonial structure in Cape Town',
    ],
    educationalFocus: 'Cape slavery, VOC history, Indian Ocean trade networks, emancipation',
    bookingInfo: {
      available: true,
      method: 'Walk-in or Iziko online',
      contact: '+27 21 460 8242',
      url: 'https://www.iziko.org.za/museums/slave-lodge',
    },
    openingHours: 'Mon–Sat 9am–5pm',
    address: '49 Adderley St, Cape Town CBD',
  },
  {
    id: 'bo-kaap-museum',
    stationId: 'cape_town',
    name: 'Bo-Kaap Museum',
    tagline: '400 years of Cape Malay identity',
    description:
      'The Bo-Kaap is Cape Town\'s most visually striking neighbourhood — cobbled streets lined with brightly painted houses on the slopes of Signal Hill. The museum occupies the oldest surviving house in the area and documents the history of the Cape Malay community, descended from enslaved people and political exiles brought from the Dutch East Indies.',
    category: 'heritage',
    budget: 'budget',
    priceZAR: 30,
    duration: '1 hour',
    highlights: [
      'Original 18th-century interior of a Cape Malay home',
      'History of Cape Islam — the first mosque in Sub-Saharan Africa',
      'Bo-Kaap neighbourhood walking map',
      'Cape Malay cuisine and spice trade history',
    ],
    educationalFocus: 'Cape Malay culture, Islamic heritage, Dutch East Indies history, slavery',
    bookingInfo: {
      available: false,
      method: 'Walk-in',
      contact: '+27 21 481 3939',
    },
    openingHours: 'Mon–Sat 10am–5pm',
    address: '71 Wale St, Bo-Kaap, Cape Town',
  },
  {
    id: 'robben-island',
    stationId: 'cape_town',
    name: 'Robben Island Museum',
    tagline: 'Where Mandela was imprisoned — now a World Heritage Site',
    description:
      'For 27 years Nelson Mandela was held on Robben Island, 11 km off Cape Town. Tours are led by former political prisoners who were themselves incarcerated here. The small limestone cell where Mandela spent 18 years, the quarry where prisoners were forced to dig, and the island\'s layered history as a leper colony and military base make this one of the world\'s most important sites of conscience.',
    category: 'history',
    budget: 'premium',
    priceZAR: 650,
    duration: '4 hours (includes ferry)',
    highlights: [
      'Nelson Mandela\'s cell — B Section, Cell 5',
      'Guided tour by a former political prisoner',
      'The lime quarry where prisoners were forced to work',
      'The island\'s history as a leper colony, WWII base, and prison',
    ],
    educationalFocus: 'Anti-apartheid resistance, political imprisonment, Mandela, human rights',
    bookingInfo: {
      available: true,
      method: 'Online booking strongly recommended — sells out weeks ahead',
      contact: '+27 21 413 4220',
      url: 'https://www.robben-island.org.za',
    },
    openingHours: 'Ferry departs V&A Waterfront: 9am, 11am, 1pm daily',
    address: 'V&A Waterfront, Clock Tower, Cape Town',
  },
]

/** Get all attractions for a specific station */
export function getAttractionsByStation(stationId: string): Attraction[] {
  return ATTRACTIONS.filter(a => a.stationId === stationId)
}

/** Filter attractions by budget tier */
export function filterByBudget(attractions: Attraction[], tier: BudgetTier): Attraction[] {
  return attractions.filter(a => a.budget === tier)
}

/** All unique station IDs that have attractions */
export const STATION_IDS_WITH_ATTRACTIONS = [
  ...new Set(ATTRACTIONS.map(a => a.stationId)),
]

export const BUDGET_LABELS: Record<BudgetTier, string> = {
  budget:  'Budget  (under R150)',
  mid:     'Mid-range  (R150–R500)',
  premium: 'Premium  (R500+)',
}

export const CATEGORY_LABELS: Record<AttractionCategory, string> = {
  history:      'History',
  museum:       'Museum',
  nature:       'Nature',
  heritage:     'Heritage',
  arts:         'Arts & Culture',
  science:      'Science',
  township:     'Township',
  architecture: 'Architecture',
}

export const CATEGORY_COLOURS: Record<AttractionCategory, string> = {
  history:      '#c9a45a',
  museum:       '#7a9bc9',
  nature:       '#6aab7a',
  heritage:     '#c9a45a',
  arts:         '#b07ac9',
  science:      '#7ac9c0',
  township:     '#c97a7a',
  architecture: '#c9b87a',
}
