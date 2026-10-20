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
  attachment?: { x: number; y: number };
  product_id?: number;
  available?: boolean;
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
    disabled: charm.available === false,
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
          disabled={charm.available === false}
          {...listeners}
          className={styles.charmDragHandle}
          onClick={() => onSelect(charm)}
          aria-label={`افزودن ${charm.name}؛ برای کشیدن و جای‌گذاری تصویر را نگه دار`}
        >
          <div className={styles.charmImage}>
            {charm.image ? (
              <Image
                src={charm.image}
                alt={charm.name}
                fill
                unoptimized
                draggable={false}
                sizes="(max-width: 1023px) 90px, 110px"
                className="pointer-events-none select-none object-contain"
              />
            ) : (
              <span className="text-xs text-[#8b777d]">تصویر ثبت نشده</span>
            )}
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
          disabled={charm.available === false}
          onClick={() => onAdd(charm)}
          aria-label={`افزودن ${charm.name}`}
        >
          <Plus size={15} />
          <span>{charm.available === false ? "غیرقابل سفارش" : "افزودن"}</span>
        </button>
      </div>
    </article>
  );
}
