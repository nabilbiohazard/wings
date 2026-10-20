"use client";

import Image from "next/image";
import type { SavedDesign } from "@/lib/saved-designs";
import { ATTACHMENT_POINTS } from "./Placedcharmitem";

export function SavedDesignPreview({ design }: { design: SavedDesign }) {
  return <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white" aria-hidden="true">
    {design.product.image && <Image src={design.product.image} alt="" fill unoptimized sizes="96px" className="object-contain" />}
    {design.charms.map((item) => {
      const anchor = item.charm.attachment ?? ATTACHMENT_POINTS[item.charm.id] ?? { x: 50, y: 30 };
      return <div key={item.instanceId} className="absolute aspect-square w-[49%] mix-blend-multiply" style={{ left: `${item.x / 6}%`, top: `${item.y / 6}%`, transform: `translate(-${anchor.x}%, -${anchor.y}%) rotate(${item.rotation}deg)`, transformOrigin: `${anchor.x}% ${anchor.y}%` }}><Image src={item.charm.image} alt="" fill unoptimized sizes="48px" className="object-contain" /></div>;
    })}
  </div>;
}
