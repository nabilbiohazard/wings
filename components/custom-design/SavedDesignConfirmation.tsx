"use client";

import { useEffect, useRef } from "react";
import { Check, ArrowLeft, X } from "lucide-react";
import styles from "./saved-design-confirmation.module.css";

export function SavedDesignConfirmation({
  onClose,
  onViewWishlist,
}: {
  onClose: () => void;
  onViewWishlist: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      dir="rtl"
      aria-labelledby="saved-design-confirmation-title"
      aria-describedby="saved-design-confirmation-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <button
        type="button"
        className={styles.close}
        onClick={onClose}
        aria-label="بستن پیام"
      >
        <X size={20} />
      </button>
      <span className={styles.icon} aria-hidden="true">
        <Check size={28} strokeWidth={1.8} />
      </span>
      <h2 id="saved-design-confirmation-title">
        به لیست علاقه‌مندی‌ها اضافه شد
      </h2>
      <p id="saved-design-confirmation-description">
        طرح تو ذخیره شد؛ هر وقت خواستی می‌توانی دوباره آن را ببینی و ویرایش کنی.
      </p>
      <button
        type="button"
        className={styles.action}
        onClick={() => {
          dialogRef.current?.close();
          onViewWishlist();
        }}
      >
        مشاهدهٔ لیست علاقه‌مندی‌ها <ArrowLeft size={18} />
      </button>
    </dialog>
  );
}
