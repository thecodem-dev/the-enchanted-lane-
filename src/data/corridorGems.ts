/**
 * corridorGems.ts — the 25 local businesses (SMMEs) used by the Gem Matcher
 * on the Hidden Gems page. Ported unchanged from the standalone
 * "Hidden Gems Match Engine" prototype.
 */

export type PriceBand = 'R50 - R150' | 'R150 - R350' | 'R350 - R750'

export interface CorridorGem {
  id: string
  name: string
  category: string
  city: string
  province: string
  lat: number
  lng: number
  priceBand: PriceBand
  /** Typical spend per person, ZAR */
  avgSpend: number
  tags: string[]
  /** Guaranteed backup power during load-shedding */
  backupPower: boolean
  domesticRating: number
  intlRating: number
  reviews: number
}

export const CORRIDOR_GEMS: CorridorGem[] = [
  { id: 'ZA_SMME_001', name: 'Tshwane Specialty Coffee Co', category: 'Cafe & Roastery', city: 'Pretoria', province: 'Gauteng', lat: -25.747, lng: 28.229, priceBand: 'R150 - R350', avgSpend: 250, tags: ['coffee', 'artisan', 'breakfast', 'work_friendly'], backupPower: true, domesticRating: 4.8, intlRating: 4.6, reviews: 142 },
  { id: 'ZA_SMME_002', name: 'Culinary Heritage Soweto', category: 'Local Food & Tours', city: 'Soweto', province: 'Gauteng', lat: -26.237, lng: 27.908, priceBand: 'R150 - R350', avgSpend: 250, tags: ['heritage', 'township', 'traditional_food', 'culture'], backupPower: true, domesticRating: 4.7, intlRating: 4.9, reviews: 310 },
  { id: 'ZA_SMME_003', name: 'Maboneng Crafts & Design Hub', category: 'Art & Handcrafts', city: 'Johannesburg', province: 'Gauteng', lat: -26.204, lng: 28.057, priceBand: 'R150 - R350', avgSpend: 250, tags: ['art', 'fashion', 'design', 'crafts', 'urban'], backupPower: false, domesticRating: 4.5, intlRating: 4.8, reviews: 185 },
  { id: 'ZA_SMME_004', name: 'Cradle Bushveld Pottery Studio', category: 'Crafts & Workshop', city: 'Muldersdrift', province: 'Gauteng', lat: -26.033, lng: 27.848, priceBand: 'R350 - R750', avgSpend: 500, tags: ['nature', 'pottery', 'workshop', 'family_friendly'], backupPower: true, domesticRating: 4.9, intlRating: 4.5, reviews: 78 },
  { id: 'ZA_SMME_005', name: 'Vaal River Artisanal Bakery', category: 'Bakery & Cafe', city: 'Vanderbijlpark', province: 'Gauteng', lat: -26.702, lng: 27.838, priceBand: 'R50 - R150', avgSpend: 100, tags: ['bakery', 'pastries', 'river_view', 'casual'], backupPower: true, domesticRating: 4.6, intlRating: 4.2, reviews: 96 },
  { id: 'ZA_SMME_006', name: 'Parys Antique & Vintage Emporium', category: 'Antiques & Collectibles', city: 'Parys', province: 'Free State', lat: -26.902, lng: 27.456, priceBand: 'R150 - R350', avgSpend: 250, tags: ['antiques', 'roadtrip', 'shopping', 'retro'], backupPower: false, domesticRating: 4.8, intlRating: 4.3, reviews: 215 },
  { id: 'ZA_SMME_007', name: "Ouma's Boerewors & Padstal", category: 'Farm Stall & Butchery', city: 'Kroonstad', province: 'Free State', lat: -27.653, lng: 27.234, priceBand: 'R50 - R150', avgSpend: 100, tags: ['padstal', 'biltong', 'local_food', 'roadtrip'], backupPower: true, domesticRating: 4.9, intlRating: 4.1, reviews: 340 },
  { id: 'ZA_SMME_008', name: 'Bloemfontein Rose Garden B&B', category: 'Boutique Stay', city: 'Bloemfontein', province: 'Free State', lat: -29.118, lng: 26.225, priceBand: 'R350 - R750', avgSpend: 500, tags: ['boutique_stay', 'garden', 'peaceful', 'overnight'], backupPower: true, domesticRating: 4.7, intlRating: 4.6, reviews: 112 },
  { id: 'ZA_SMME_009', name: 'Highveld Craft Brewery', category: 'Microbrewery & Grill', city: 'Parys', province: 'Free State', lat: -26.895, lng: 27.461, priceBand: 'R150 - R350', avgSpend: 250, tags: ['craft_beer', 'pub_grub', 'family_friendly', 'outdoor'], backupPower: true, domesticRating: 4.6, intlRating: 4.4, reviews: 164 },
  { id: 'ZA_SMME_010', name: 'Free State Honey & Jam House', category: 'Farm Stall', city: 'Ventersburg', province: 'Free State', lat: -28.086, lng: 27.138, priceBand: 'R50 - R150', avgSpend: 100, tags: ['organic', 'honey', 'preserves', 'roadtrip_stop'], backupPower: false, domesticRating: 4.5, intlRating: 4.0, reviews: 53 },
  { id: 'ZA_SMME_011', name: 'Colesberg Karoo Lamb Kitchen', category: 'Restaurant', city: 'Colesberg', province: 'Northern Cape', lat: -30.722, lng: 25.097, priceBand: 'R150 - R350', avgSpend: 250, tags: ['karoo_lamb', 'traditional', 'dinner', 'authentic'], backupPower: true, domesticRating: 4.9, intlRating: 4.8, reviews: 289 },
  { id: 'ZA_SMME_012', name: 'Richmond Book Town Gallery', category: 'Bookshop & Cafe', city: 'Richmond', province: 'Northern Cape', lat: -31.413, lng: 23.947, priceBand: 'R50 - R150', avgSpend: 100, tags: ['books', 'vintage', 'cozy', 'heritage', 'quiet'], backupPower: false, domesticRating: 4.8, intlRating: 4.7, reviews: 87 },
  { id: 'ZA_SMME_013', name: 'Beaufort West Farmhouse Bakery', category: 'Bakery & Coffee', city: 'Beaufort West', province: 'Western Cape', lat: -32.355, lng: 22.581, priceBand: 'R50 - R150', avgSpend: 100, tags: ['bakery', 'pies', 'coffee', 'roadtrip_essential'], backupPower: true, domesticRating: 4.6, intlRating: 4.5, reviews: 410 },
  { id: 'ZA_SMME_014', name: 'Three Sisters Windmill Padstal', category: 'Farm Stall & Gifts', city: 'Three Sisters', province: 'Western Cape', lat: -31.912, lng: 23.155, priceBand: 'R50 - R150', avgSpend: 100, tags: ['padstal', 'crafts', 'biltong', 'scenic'], backupPower: true, domesticRating: 4.7, intlRating: 4.4, reviews: 198 },
  { id: 'ZA_SMME_015', name: 'Karoo Olives & Tapenade Co', category: 'Artisanal Producer', city: 'Prince Albert Road', province: 'Western Cape', lat: -32.968, lng: 21.668, priceBand: 'R150 - R350', avgSpend: 250, tags: ['olives', 'tasting', 'artisanal', 'local_produce'], backupPower: true, domesticRating: 4.8, intlRating: 4.6, reviews: 105 },
  { id: 'ZA_SMME_016', name: 'Touws River Desert Observatory & Cafe', category: 'Ecotourism & Cafe', city: 'Touws River', province: 'Western Cape', lat: -33.338, lng: 19.997, priceBand: 'R150 - R350', avgSpend: 250, tags: ['stargazing', 'ecotourism', 'nature', 'desert'], backupPower: true, domesticRating: 4.6, intlRating: 4.8, reviews: 92 },
  { id: 'ZA_SMME_017', name: 'Worcester Valley Olive & Wine Boutique', category: 'Boutique Winery', city: 'Worcester', province: 'Western Cape', lat: -33.646, lng: 19.447, priceBand: 'R350 - R750', avgSpend: 500, tags: ['wine', 'olives', 'scenic', 'tasting'], backupPower: true, domesticRating: 4.7, intlRating: 4.9, reviews: 156 },
  { id: 'ZA_SMME_018', name: 'Paarl Heritage Spice Kitchen', category: 'Culinary & Restaurant', city: 'Paarl', province: 'Western Cape', lat: -33.724, lng: 18.962, priceBand: 'R350 - R750', avgSpend: 500, tags: ['cape_malay', 'wine_pairing', 'heritage', 'fine_casual'], backupPower: true, domesticRating: 4.8, intlRating: 4.9, reviews: 275 },
  { id: 'ZA_SMME_019', name: 'Stellenbosch Village Artisan Bakery', category: 'Bakery & Coffee', city: 'Stellenbosch', province: 'Western Cape', lat: -33.932, lng: 18.86, priceBand: 'R150 - R350', avgSpend: 250, tags: ['sourdough', 'coffee', 'walkable', 'historic'], backupPower: true, domesticRating: 4.9, intlRating: 4.8, reviews: 420 },
  { id: 'ZA_SMME_020', name: 'Franschhoek Craft Distillery', category: 'Distillery', city: 'Franschhoek', province: 'Western Cape', lat: -33.907, lng: 19.122, priceBand: 'R350 - R750', avgSpend: 500, tags: ['gin', 'fynbos', 'tasting', 'boutique'], backupPower: true, domesticRating: 4.8, intlRating: 4.9, reviews: 210 },
  { id: 'ZA_SMME_021', name: 'Bo-Kaap Cooking School & Spice Shop', category: 'Cultural Cooking Experience', city: 'Cape Town', province: 'Western Cape', lat: -33.921, lng: 18.413, priceBand: 'R350 - R750', avgSpend: 500, tags: ['cape_malay', 'cooking_class', 'heritage', 'culture'], backupPower: true, domesticRating: 4.8, intlRating: 5.0, reviews: 512 },
  { id: 'ZA_SMME_022', name: 'Woodstock Artisanal Leatherworks', category: 'Handcrafts & Leather', city: 'Cape Town', province: 'Western Cape', lat: -33.927, lng: 18.446, priceBand: 'R350 - R750', avgSpend: 500, tags: ['leather', 'handcrafted', 'design', 'shopping'], backupPower: false, domesticRating: 4.7, intlRating: 4.8, reviews: 134 },
  { id: 'ZA_SMME_023', name: 'Langa Township Cultural Cafe & Art', category: 'Cafe & Guided Tours', city: 'Cape Town', province: 'Western Cape', lat: -33.945, lng: 18.528, priceBand: 'R150 - R350', avgSpend: 250, tags: ['township', 'live_music', 'art', 'traditional_food'], backupPower: true, domesticRating: 4.6, intlRating: 4.9, reviews: 380 },
  { id: 'ZA_SMME_024', name: 'Kalk Bay Harbour Seafood Shack', category: 'Seafood Restaurant', city: 'Cape Town', province: 'Western Cape', lat: -34.128, lng: 18.45, priceBand: 'R150 - R350', avgSpend: 250, tags: ['seafood', 'ocean_view', 'casual', 'fresh_fish'], backupPower: true, domesticRating: 4.9, intlRating: 4.8, reviews: 620 },
  { id: 'ZA_SMME_025', name: 'Hout Bay Community Craft Market', category: 'Market & Crafts', city: 'Cape Town', province: 'Western Cape', lat: -34.045, lng: 18.351, priceBand: 'R50 - R150', avgSpend: 100, tags: ['market', 'crafts', 'beadwork', 'family_friendly'], backupPower: false, domesticRating: 4.7, intlRating: 4.7, reviews: 440 },
]

/** Interest groups built from the dataset's own tags — every tag belongs to exactly one */
export const INTERESTS: Record<string, string[]> = {
  'Heritage & culture': ['heritage', 'culture', 'traditional', 'traditional_food', 'township', 'cape_malay', 'historic', 'authentic', 'karoo_lamb', 'live_music'],
  'Food & dining': ['dinner', 'fresh_fish', 'seafood', 'local_food', 'pub_grub', 'fine_casual', 'cooking_class', 'pies', 'breakfast'],
  'Coffee & bakes': ['coffee', 'bakery', 'pastries', 'sourdough', 'work_friendly', 'cozy', 'walkable'],
  'Wine & craft drinks': ['wine', 'wine_pairing', 'gin', 'craft_beer', 'tasting', 'olives', 'fynbos', 'boutique'],
  'Nature & scenic': ['nature', 'scenic', 'river_view', 'ocean_view', 'desert', 'stargazing', 'ecotourism', 'garden', 'peaceful', 'outdoor'],
  'Arts, crafts & markets': ['art', 'crafts', 'design', 'fashion', 'handcrafted', 'leather', 'pottery', 'workshop', 'beadwork', 'market', 'antiques', 'vintage', 'retro', 'shopping', 'books', 'urban'],
  'Farm stalls & road trip': ['padstal', 'biltong', 'roadtrip', 'roadtrip_stop', 'roadtrip_essential', 'organic', 'honey', 'preserves', 'local_produce', 'artisan', 'artisanal'],
  'Family & overnight': ['family_friendly', 'boutique_stay', 'overnight', 'quiet', 'casual'],
}

export type TravelerProfile = 'solo' | 'family' | 'couple' | 'foodie'

export const PROFILES: { value: TravelerProfile; label: string; tags: string[] }[] = [
  { value: 'solo',   label: 'Solo explorer',    tags: ['work_friendly', 'quiet', 'cozy', 'urban', 'books'] },
  { value: 'family', label: 'Family',           tags: ['family_friendly', 'outdoor', 'pub_grub', 'padstal'] },
  { value: 'couple', label: 'Couple / romantic', tags: ['scenic', 'wine', 'tasting', 'boutique_stay', 'peaceful'] },
  { value: 'foodie', label: 'Foodie',           tags: ['traditional_food', 'karoo_lamb', 'fresh_fish', 'seafood', 'cape_malay', 'local_food', 'fine_casual'] },
]

export const PRICE_BANDS: PriceBand[] = ['R50 - R150', 'R150 - R350', 'R350 - R750']
