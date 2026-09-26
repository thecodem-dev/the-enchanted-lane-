import type { QuizQuestion } from '@/types'

/**
 * Three questions per station — 27 total.
 * Only questions whose stationId is in `awoken` are shown.
 * The UI caps the active quiz at MAX_QUIZ_QUESTIONS drawn in station order.
 */
export const MAX_QUIZ_QUESTIONS = 10

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ── I · Pretoria ──────────────────────────────────────────────
  {
    id: 'pta-1',
    stationId: 'pretoria',
    question: 'What tree turns Pretoria purple each October?',
    options: ['Flame Tree', 'Jacaranda', 'Fever Tree', 'Wild Fig'],
    correctIndex: 1,
    explanation:
      'Over 70,000 jacaranda trees bloom each October, blanketing Pretoria in violet — the spectacle that gave rise to the city\'s nickname "Jacaranda City".',
  },
  {
    id: 'pta-2',
    stationId: 'pretoria',
    question: 'Which building serves as the seat of South Africa\'s government in Pretoria?',
    options: ['Cape Town Parliament', 'Union Buildings', 'Voortrekker Monument', 'Palace of Justice'],
    correctIndex: 1,
    explanation:
      'The Union Buildings survey the city from a ridge above it. Completed in 1913, they have been the seat of the South African government ever since.',
  },
  {
    id: 'pta-3',
    stationId: 'pretoria',
    question: 'Which historic treaty ending the Anglo-Boer War was signed at Melrose House?',
    options: ['Treaty of Pretoria', 'Treaty of Vereeniging', 'Sand River Convention', 'Bloemfontein Convention'],
    correctIndex: 1,
    explanation:
      'The Treaty of Vereeniging, signed at Melrose House on 31 May 1902, ended the Second Anglo-Boer War and brought the Boer republics under British sovereignty.',
  },

  // ── II · Johannesburg ─────────────────────────────────────────
  {
    id: 'jhb-1',
    stationId: 'johannesburg',
    question: 'In what year did the gold rush that founded Johannesburg begin?',
    options: ['1867', '1886', '1902', '1910'],
    correctIndex: 1,
    explanation:
      'The discovery of gold on the Witwatersrand in 1886 triggered one of history\'s greatest rushes, turning a surveyor\'s tent city into a metropolis within a decade.',
  },
  {
    id: 'jhb-2',
    stationId: 'johannesburg',
    question: 'What does "eGoli" — Johannesburg\'s Zulu name — mean?',
    options: ['Place of Fire', 'Place of Gold', 'Place of Mines', 'Place of Dreams'],
    correctIndex: 1,
    explanation:
      '"eGoli" means "place of gold" in isiZulu, a name earned by the extraordinary wealth the Witwatersrand reef produced.',
  },
  {
    id: 'jhb-3',
    stationId: 'johannesburg',
    question: 'How deep can visitors descend into the Gold Reef City mine shaft?',
    options: ['50 metres', '120 metres', '250 metres', '400 metres'],
    correctIndex: 2,
    explanation:
      'Gold Reef City preserves a working shaft that drops 250 metres, giving visitors a rare glimpse into the underground world that made Johannesburg.',
  },

  // ── III · Klerksdorp ──────────────────────────────────────────
  {
    id: 'klk-1',
    stationId: 'klerksdorp',
    question: 'How old are the mysterious grooved metallic spheres found near Klerksdorp?',
    options: ['300 million years', '1.2 billion years', '2.8 billion years', '4.5 billion years'],
    correctIndex: 2,
    explanation:
      'The Klerksdorp spheres are estimated at 2.8 billion years old — predating complex life on Earth — making them one of geology\'s most intriguing unsolved mysteries.',
  },
  {
    id: 'klk-2',
    stationId: 'klerksdorp',
    question: 'Which wildlife species can be seen in the Faan Meintjes Nature Reserve near Klerksdorp?',
    options: ['Lion and leopard', 'Black wildebeest and springbok', 'Elephant and hippo', 'Cheetah and wild dog'],
    correctIndex: 1,
    explanation:
      'Faan Meintjes Nature Reserve protects open highveld grassland and is home to black wildebeest, springbok, and a variety of antelope species.',
  },
  {
    id: 'klk-3',
    stationId: 'klerksdorp',
    question: 'What makes Klerksdorp one of South Africa\'s oldest towns?',
    options: [
      'It was a Voortrekker capital',
      'It is one of the earliest European settlements in the country',
      'It hosted the first gold discovery',
      'It was founded by the Dutch East India Company',
    ],
    correctIndex: 1,
    explanation:
      'Klerksdorp is among South Africa\'s oldest European settlements, established on the edge of the Highveld long before the gold and diamond rushes transformed the interior.',
  },

  // ── IV · Kimberley ────────────────────────────────────────────
  {
    id: 'kim-1',
    stationId: 'kimberley',
    question: 'How wide is the Big Hole in Kimberley at its broadest point?',
    options: ['120 metres', '250 metres', '463 metres', '800 metres'],
    correctIndex: 2,
    explanation:
      'The Big Hole measures 463 metres wide and 97 metres deep — the largest hand-dug excavation on Earth, carved out entirely by human hands between 1871 and 1914.',
  },
  {
    id: 'kim-2',
    stationId: 'kimberley',
    question: 'How many kilograms of diamonds were extracted from the Big Hole?',
    options: ['450 kg', '1,100 kg', '2,722 kg', '5,000 kg'],
    correctIndex: 2,
    explanation:
      '2,722 kilograms of diamonds were pulled from the Big Hole over its operational life — wealth that reshaped South Africa\'s destiny and attracted imperial ambition.',
  },
  {
    id: 'kim-3',
    stationId: 'kimberley',
    question: 'Which famous imperialist had a Kimberley residence now preserved as Rudd House?',
    options: ['Paul Kruger', 'Cecil Rhodes', 'Lord Milner', 'Jan Smuts'],
    correctIndex: 1,
    explanation:
      'Cecil Rhodes made his fortune in Kimberley\'s diamond fields. Rudd House, his Kimberley residence, is preserved as it was in the 1890s.',
  },

  // ── V · De Aar ────────────────────────────────────────────────
  {
    id: 'daa-1',
    stationId: 'de_aar',
    question: 'What does the Dutch name "De Aar" mean?',
    options: ['The Crossing', 'The Vein', 'The Junction', 'The Heart'],
    correctIndex: 1,
    explanation:
      '"De Aar" means "the vein" in Dutch — perfectly describing this rail junction through which South Africa\'s entire network converges.',
  },
  {
    id: 'daa-2',
    stationId: 'de_aar',
    question: 'What was notable about De Aar\'s locomotive workshops during the steam age?',
    options: [
      'They built the first electric locomotive in Africa',
      'They were the largest in the Southern Hemisphere',
      'They trained the most engineers in the country',
      'They designed the Blue Train',
    ],
    correctIndex: 1,
    explanation:
      'At its steam-age peak De Aar operated one of the largest locomotive workshops in the entire Southern Hemisphere — a cathedral of iron, grease, and industrial ambition.',
  },
  {
    id: 'daa-3',
    stationId: 'de_aar',
    question: 'What natural feature makes De Aar a destination for stargazers?',
    options: [
      'It has an observatory on a nearby mountain',
      'It lies directly on the Tropic of Capricorn',
      'It has some of the darkest night skies on the continent',
      'It hosts an annual meteor shower festival',
    ],
    correctIndex: 2,
    explanation:
      'Far from city light pollution, the Karoo around De Aar offers some of the darkest night skies in Africa — a vast, uninterrupted canvas above an empty horizon.',
  },

  // ── VI · Beaufort West ────────────────────────────────────────
  {
    id: 'bfw-1',
    stationId: 'beaufort_west',
    question: 'Which world-first medical achievement is associated with Beaufort West?',
    options: [
      'First successful kidney transplant',
      'First successful heart transplant',
      'First open-heart surgery',
      'First blood transfusion in Africa',
    ],
    correctIndex: 1,
    explanation:
      'Christiaan Barnard, born in Beaufort West, performed the world\'s first successful human heart transplant in Cape Town on 3 December 1967.',
  },
  {
    id: 'bfw-2',
    stationId: 'beaufort_west',
    question: 'What is the Nuweveld Plateau known for geologically?',
    options: [
      'Ancient volcanic rock formations',
      'Triassic and Jurassic fossils locked in shale',
      'Precambrian diamond deposits',
      'The oldest exposed granite in Africa',
    ],
    correctIndex: 1,
    explanation:
      'The Nuweveld Plateau surrounding Beaufort West contains Triassic and Jurassic fossils embedded in shale — millions of years of geological time made visible.',
  },
  {
    id: 'bfw-3',
    stationId: 'beaufort_west',
    question: 'Beaufort West is the oldest town in which South African region?',
    options: ['The Winelands', 'The Highveld', 'The Great Karoo', 'The Garden Route'],
    correctIndex: 2,
    explanation:
      'Beaufort West is the oldest town in the Great Karoo — that vast, semi-arid interior plateau that stretches across the heart of South Africa.',
  },

  // ── VII · Matjiesfontein ──────────────────────────────────────
  {
    id: 'mat-1',
    stationId: 'matjiesfontein',
    question: 'In what year was Matjiesfontein founded by James Douglas Logan?',
    options: ['1860', '1884', '1899', '1910'],
    correctIndex: 1,
    explanation:
      'Scottish immigrant James Douglas Logan founded Matjiesfontein in 1884. Every original building still stands, frozen as a National Monument.',
  },
  {
    id: 'mat-2',
    stationId: 'matjiesfontein',
    question: 'What unusual vehicle serves as the town taxi in Matjiesfontein?',
    options: [
      'A vintage Cape cart',
      'A red London double-decker bus',
      'A restored ox-wagon',
      'A steam-powered tram',
    ],
    correctIndex: 1,
    explanation:
      'A single red London double-decker bus is the town\'s taxi — an incongruous, perfectly preserved slice of Victoriana in the heart of the Karoo.',
  },
  {
    id: 'mat-3',
    stationId: 'matjiesfontein',
    question: 'For how many years has the Lord Milner Hotel in Matjiesfontein operated without significant change?',
    options: ['60 years', '90 years', '120 years', '140 years'],
    correctIndex: 3,
    explanation:
      'The Lord Milner Hotel has operated largely unchanged since 1884 — approximately 140 years of colonial grandeur preserved in amber in the Karoo.',
  },

  // ── VIII · Worcester ──────────────────────────────────────────
  {
    id: 'wrc-1',
    stationId: 'worcester',
    question: 'Which mountain range cradles the Worcester valley and carries snow each winter?',
    options: ['Outeniqua Mountains', 'Langeberg Range', 'Hex River Mountains', 'Hottentots Holland'],
    correctIndex: 2,
    explanation:
      'The Hex River Mountains frame the Worcester valley, their peaks snow-capped each winter — an unlikely and breathtaking contrast above the warm valley floor.',
  },
  {
    id: 'wrc-2',
    stationId: 'worcester',
    question: 'What is the Breede River Valley best known for producing?',
    options: ['Citrus fruit', 'Rooibos tea', 'Wine grapes', 'Fynbos flowers'],
    correctIndex: 2,
    explanation:
      'The Breede River Valley is South Africa\'s largest wine grape producing valley, blending pastoral grandeur with a living Cape Colony winemaking tradition.',
  },
  {
    id: 'wrc-3',
    stationId: 'worcester',
    question: 'What can visitors experience at the Kleinplasie Open Air Museum in Worcester?',
    options: [
      'A working Victorian railway station',
      'Live brandy distilling and rusk-baking',
      'Diamond sorting demonstrations',
      'Authentic Nguni cattle herding',
    ],
    correctIndex: 1,
    explanation:
      'Kleinplasie\'s open-air museum brings Cape Colony farm life to life — visitors can watch brandy being distilled and rusks baked using traditional methods.',
  },

  // ── IX · Cape Town ────────────────────────────────────────────
  {
    id: 'cpt-1',
    stationId: 'cape_town',
    question: 'In what year was Cape Town founded by the Dutch East India Company?',
    options: ['1602', '1652', '1688', '1710'],
    correctIndex: 1,
    explanation:
      'The Dutch East India Company established a refreshment station at the Cape in 1652, making Cape Town Africa\'s oldest colonial city.',
  },
  {
    id: 'cpt-2',
    stationId: 'cape_town',
    question: 'Table Mountain holds which international distinction?',
    options: [
      'UNESCO World Heritage Site',
      'One of the Seven Natural Wonders of the World',
      'The most visited mountain in Africa',
      'Africa\'s highest flat-topped peak',
    ],
    correctIndex: 1,
    explanation:
      'Table Mountain was declared one of the New Seven Wonders of Nature in 2011, recognising its extraordinary biodiversity and iconic silhouette.',
  },
  {
    id: 'cpt-3',
    stationId: 'cape_town',
    question: 'Which Cape Town neighbourhood is famous for its painted houses and 400 years of Cape Malay heritage?',
    options: ['Woodstock', 'Bo-Kaap', 'Green Point', 'Sea Point'],
    correctIndex: 1,
    explanation:
      'Bo-Kaap\'s brightly painted houses and cobblestone streets preserve four centuries of Cape Malay culture — one of Cape Town\'s most enduring and vibrant communities.',
  },
]
