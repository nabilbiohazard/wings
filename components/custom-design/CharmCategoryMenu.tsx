"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import styles from "./charm-category-menu.module.css";

export function CharmCategoryMenu({
  categories,
  value,
  onChange,
}: {
  categories: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{
    left: number;
    top: number;
    width: number;
    maxHeight: number;
  } | null>(null);
  function close(restoreFocus = false) {
    setPosition(null);
    if (restoreFocus) triggerRef.current?.focus();
  }
  function open() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = Math.min(210, window.innerWidth - 24);
    const below = window.innerHeight - rect.bottom - 14;
    const openBelow = below >= Math.min(150, rect.top - 14);
    const height = Math.max(
      40,
      Math.min(260, openBelow ? below : rect.top - 14),
    );
    setPosition({
      left: Math.max(
        12,
        Math.min(rect.right - width, window.innerWidth - width - 12),
      ),
      top: openBelow ? rect.bottom + 6 : Math.max(12, rect.top - height - 6),
      width,
      maxHeight: height,
    });
  }
  useEffect(() => {
    if (!position) return;
    menuRef.current
      ?.querySelector<HTMLElement>('[aria-checked="true"]')
      ?.focus();
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      )
        setPosition(null);
    };
    const dismiss = () => setPosition(null);
    const scroll = (event: Event) => {
      if (!menuRef.current?.contains(event.target as Node)) dismiss();
    };
    document.addEventListener("pointerdown", outside);
    window.addEventListener("resize", dismiss);
    window.addEventListener("scroll", scroll, true);
    return () => {
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("resize", dismiss);
      window.removeEventListener("scroll", scroll, true);
    };
  }, [position]);
  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-label={`دسته‌بندی چارم: ${value}`}
        aria-haspopup="menu"
        aria-expanded={Boolean(position)}
        aria-controls={position ? id : undefined}
        onClick={() => (position ? close() : open())}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            open();
          }
        }}
      >
        <span>{value === "همه" ? "همه دسته‌ها" : value}</span>
        <ChevronDown size={14} />
      </button>
      {position &&
        createPortal(
          <div
            ref={menuRef}
            id={id}
            role="menu"
            aria-label="دسته‌بندی چارم‌ها"
            className={styles.menu}
            dir="rtl"
            style={position}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                close(true);
              }
              if (event.key === "Tab") close();
              if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
                event.preventDefault();
                const items = Array.from(
                  menuRef.current?.querySelectorAll<HTMLButtonElement>(
                    "button",
                  ) ?? [],
                );
                const current = items.indexOf(
                  document.activeElement as HTMLButtonElement,
                );
                const next =
                  event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? items.length - 1
                      : (current +
                          (event.key === "ArrowDown" ? 1 : -1) +
                          items.length) %
                        items.length;
                items[next]?.focus();
              }
            }}
          >
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                role="menuitemradio"
                aria-checked={value === category}
                tabIndex={-1}
                onClick={() => {
                  onChange(category);
                  close(true);
                }}
              >
                <span>{category === "همه" ? "همه دسته‌ها" : category}</span>
                {value === category && <Check size={15} />}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
