// Rings in a 600px viewBox after enlarging the square artwork 1.6x about its center.
export const RING_NECKLACE_IMAGE_SCALE = 1.6;
export const NECKLACE_HOLES = [{"x":188.4,"y":51.6},{"x":129,"y":86.4},{"x":90,"y":141},{"x":68.4,"y":205.2},{"x":67.2,"y":274.2},{"x":81.6,"y":341.4},{"x":112.2,"y":407.4},{"x":153,"y":469.2},{"x":216.6,"y":522.6},{"x":297,"y":550.2},{"x":380.4,"y":521.4},{"x":442.2,"y":469.2},{"x":484.8,"y":407.4},{"x":516.6,"y":341.4},{"x":531.6,"y":273},{"x":528.6,"y":204},{"x":506.4,"y":138},{"x":462,"y":84.6},{"x":388.2,"y":47.4}];
export function nearestNecklaceHole(point: {x:number;y:number}) { return NECKLACE_HOLES.reduce((best,hole)=>Math.hypot(hole.x-point.x,hole.y-point.y)<Math.hypot(best.x-point.x,best.y-point.y)?hole:best); }

// The charm's local downward axis follows the outward normal of the chain.
export function ringNecklaceRotation(x: number, y: number): number {
  return Math.atan2((y - 300) / (250 * 250), (x - 300) / (232 * 232)) * 180 / Math.PI - 90;
}
