/**
 * gemMatcher.ts — scores the corridor gems against a traveller's filters.
 * Same weighting as the original Match Engine prototype.
 *
 *   score = 0.7 × tag overlap   (share of the gem's own tags inside the picked interests;
 *                                0.6 when no interest is picked)
 *         + 0.15               (if any tag matches the traveller profile)
 *         + 0.15 × intlRating/5
 */

import { CORRIDOR_GEMS, INTERESTS, PROFILES, type CorridorGem, type PriceBand, type TravelerProfile } from '@/data/corridorGems'

export interface MatchFilters {
  budget: PriceBand | ''
  profile: TravelerProfile | ''
  interests: string[]
  /** Only gems with guaranteed backup power */
  requireBackupPower: boolean
  /** Only gems with an average spend of R150 or less */
  quickStop: boolean
}

export const DEFAULT_FILTERS: MatchFilters = {
  budget: '',
  profile: '',
  interests: [],
  requireBackupPower: true,
  quickStop: false,
}

export interface GemMatch {
  gem: CorridorGem
  /** 0–100 */
  score: number
}

export function computeMatches(filters: MatchFilters, limit = 3): GemMatch[] {
  const pool = CORRIDOR_GEMS.filter(g => {
    if (filters.requireBackupPower && !g.backupPower) return false
    if (filters.quickStop && g.avgSpend > 150) return false
    if (filters.budget && g.priceBand !== filters.budget) return false
    return true
  })

  const interestTags = filters.interests.flatMap(name => INTERESTS[name] ?? [])
  const profileTags = PROFILES.find(p => p.value === filters.profile)?.tags ?? []

  const scored = pool.map(gem => {
    const tagScore = interestTags.length
      ? gem.tags.filter(t => interestTags.includes(t)).length / gem.tags.length
      : 0.6
    const profileBoost = profileTags.length && gem.tags.some(t => profileTags.includes(t)) ? 0.15 : 0
    const ratingBoost = (gem.intlRating / 5) * 0.15
    return { gem, score: Math.round(Math.min(1, tagScore * 0.7 + profileBoost + ratingBoost) * 100) }
  })

  scored.sort((a, b) => b.score - a.score || b.gem.reviews - a.gem.reviews)
  return scored.filter(s => (interestTags.length ? s.score > 0 : true)).slice(0, limit)
}

/** Headline numbers for the corridor snapshot */
export function corridorSnapshot() {
  const n = CORRIDOR_GEMS.length
  return {
    total: n,
    backupPowerPct: Math.round((CORRIDOR_GEMS.filter(g => g.backupPower).length / n) * 100),
    avgIntlRating: CORRIDOR_GEMS.reduce((sum, g) => sum + g.intlRating, 0) / n,
    provinces: new Set(CORRIDOR_GEMS.map(g => g.province)).size,
  }
}

/** "work_friendly" → "work friendly" */
export function tagLabel(tag: string) {
  return tag.replace(/_/g, ' ')
}
