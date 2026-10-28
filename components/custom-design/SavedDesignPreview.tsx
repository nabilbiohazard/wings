"use client";

import Image from "next/image";
import type { SavedDesign } from "@/lib/saved-designs";
import { ATTACHMENT_POINTS } from "./Placedcharmitem";

export function SavedDesignPreview({
  design,
  large = false,
}: {
  design: SavedDesign;
  large?: boolean;
}) {
  return (
    <div
      className={`relative aspect-square w-full rounded-xl bg-white ${large ? "overflow-visible" : "overflow-hidden"}`}
      aria-hidden="true"
    >
      {design.product.image && (
        <Image
          src={design.product.image}
          alt=""
          fill
          unoptimized
          sizes={large ? "(max-width: 767px) 60vw, 440px" : "96px"}
          className="object-contain"
        />
      )}
      {design.charms.map((item) => {
        const anchor = item.charm.attachment ??
          ATTACHMENT_POINTS[item.charm.id] ?? { x: 50, y: 30 };
        return (
          <div
            key={item.instanceId}
            className="absolute aspect-square w-[49%]"
            style={{
              width: "var(--placed-charm-width, 49%)",
              left: `${item.x / 6}%`,
              top: `${item.y / 6}%`,
              transform: `translate(-${anchor.x}%, -${anchor.y}%) rotate(${item.rotation}deg)`,
              transformOrigin: `${anchor.x}% ${anchor.y}%`,
            }}
          >
            <Image
              src={item.charm.image}
              alt=""
              fill
              unoptimized
              sizes={large ? "220px" : "48px"}
              className="object-contain"
            />
          </div>
        );
      })}
    </div>
  );
}
