"use client";

import Image from "next/image";
import { chocolateAttachment } from "@/lib/charm-attachment";
import { designRules } from "@/lib/design-rules";
import { RING_NECKLACE_IMAGE_SCALE, ringNecklaceRotation } from "@/lib/necklace-holes";
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
          style={designRules(design.product).holes ? {
            transform: `scale(${RING_NECKLACE_IMAGE_SCALE})`,
            clipPath: `inset(${(1 - 1 / RING_NECKLACE_IMAGE_SCALE) * 50}%)`,
          } : undefined}
        />
      )}
      {design.charms.map((item) => {
        const rotation = designRules(design.product).holes ? ringNecklaceRotation(item.x, item.y) : item.rotation;
        const anchor = chocolateAttachment(item.charm) ?? item.charm.attachment ??
          ATTACHMENT_POINTS[item.charm.id] ?? { x: 50, y: 30 };
        return (
          <div
            key={item.instanceId}
            className="absolute aspect-square w-[49%]"
            style={{
              width: "var(--placed-charm-width, 49%)",
              left: `${item.x / 6}%`,
              top: `${item.y / 6}%`,
              transform: `translate(-${anchor.x}%, -${anchor.y}%) rotate(${rotation}deg)`,
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
