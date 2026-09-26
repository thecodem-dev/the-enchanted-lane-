/**
 * Builds a clip-path polygon for a torn-paper edge along the top of a band.
 * Deterministic (no Math.random) so the tear doesn't reshuffle on every render.
 * The band is filled solid below the tear; apply it to a strip that overlaps
 * the section above.
 */
export function tornTopEdge(teeth = 90, seed = 7): string {
  const points: string[] = [];
  for (let i = 0; i <= teeth; i++) {
    const x = (i / teeth) * 100;
    // Two out-of-phase sines give an irregular, fibrous rip rather than a zigzag.
    const n = Math.sin(i * 12.9898 + seed) * 43758.5453;
    const jitter = n - Math.floor(n);
    const y = 20 + jitter * 60 + Math.sin(i * 0.45 + seed) * 15;
    points.push(`${x.toFixed(2)}% ${Math.max(0, Math.min(100, y)).toFixed(1)}%`);
  }
  return `polygon(0% 100%, ${points.join(", ")}, 100% 100%)`;
}
