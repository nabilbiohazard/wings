
/**
 * Given an SVG <path> element and an (x, y) point in the SAME coordinate
 * system as the path's viewBox, find the closest point that actually lies
 * ON the path, plus `t` — its position along the path from 0 (start) to 1 (end).
 *
 * This is what makes charms "snap" onto the bracelet/necklace curve instead
 * of floating anywhere on the canvas.
 */
export function getClosestPointOnPath(
  path: SVGPathElement,
  point: { x: number; y: number }
): { x: number; y: number; t: number } {
  const pathLength = path.getTotalLength();
 
  // Coarse pass: sample the path at fixed intervals to find a rough region
  const coarseSteps = 200;
  let best = { x: 0, y: 0, t: 0 };
  let bestDist = Infinity;
 
  for (let i = 0; i <= coarseSteps; i++) {
    const t = i / coarseSteps;
    const pt = path.getPointAtLength(t * pathLength);
    const dist = Math.hypot(pt.x - point.x, pt.y - point.y);
    if (dist < bestDist) {
      bestDist = dist;
      best = { x: pt.x, y: pt.y, t };
    }
  }
 
  // Refine pass: zoom into the neighborhood of the coarse result for precision
  const refineSteps = 40;
  const window = 1 / coarseSteps; // one coarse step wide, on each side
  const coarseT = best.t;
 
  for (let i = -refineSteps; i <= refineSteps; i++) {
    const t = Math.min(1, Math.max(0, coarseT + (i / refineSteps) * window));
    const pt = path.getPointAtLength(t * pathLength);
    const dist = Math.hypot(pt.x - point.x, pt.y - point.y);
    if (dist < bestDist) {
      bestDist = dist;
      best = { x: pt.x, y: pt.y, t };
    }
  }
 
  return best;
}
 
