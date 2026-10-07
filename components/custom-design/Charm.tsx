"use client";

import Image from "next/image";
import { useDraggable } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import styles from "./builder-studio.module.css";
import { persianNumber } from "@/lib/products";

export interface CharmData {
  id: string;
  name: string;
  image: string;
  price?: number;
  category?: string;
  keywords?: string[];
}

interface PaletteCharmProps {
  charm: CharmData;
  selected: boolean;
  count?: number;
  onSelect: (charm: CharmData) => void;
  onAdd: (charm: CharmData) => void;
}

export function PaletteCharm({
  charm,
  selected,
  count = 0,
  onSelect,
  onAdd,
}: PaletteCharmProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${charm.id}`,
    data: { type: "palette" as const, charm },
  });

  return (
    <article className={styles.charmItem}>
      <div
        ref={setNodeRef}
        className={`${styles.charmCard} ${
          selected ? styles.charmCardSelected : ""
        } ${isDragging ? styles.charmCardDragging : ""}`}
      >
        {count > 0 && (
          <span className={styles.countBadge}>
            {count.toLocaleString("fa-IR")} عدد
          </span>
        )}

        <button
          type="button"
          {...attributes}
          {...listeners}
          className={styles.charmDragHandle}
          onClick={() => onSelect(charm)}
          aria-label={`انتخاب جای ${charm.name} روی محصول؛ برای کشیدن تصویر را نگه دار`}
          aria-pressed={selected}
        >
          <div className={styles.charmImage}>
            <Image
              src={charm.image}
              alt={charm.name}
              fill
              unoptimized
              draggable={false}
              sizes="(max-width: 1023px) 90px, 110px"
              className="pointer-events-none select-none object-contain"
            />
          </div>
        </button>

        <h3 title={charm.name}>{charm.name}</h3>

        {charm.price !== undefined && (
          <p className={styles.charmPrice}>
            {persianNumber(charm.price)} تومان
          </p>
        )}
      </div>
      <div className={styles.cardActions}>
        <button
          type="button"
          className={styles.addButton}
          onClick={() => onAdd(charm)}
          aria-label={`افزودن ${charm.name}`}
        >
          <Plus size={15} />
          <span>افزودن</span>
        </button>
      </div>
    </article>
  );
}
