

"use client";
 
import type { CharmData } from "./Charm";
import { PaletteCharm } from "./Charm";
 
export function CharmPalette({ charms }: { charms: CharmData[] }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-3">
      {charms.map((charm) => (
        <PaletteCharm key={charm.id} charm={charm} />
      ))}
    </div>
  );
}
 
