"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { cartKey, money } from "@/lib/commerce-types";
import { useCommerce } from "./provider";
import { SavedDesignPreview } from "../custom-design/SavedDesignPreview";

export function CartView({ onClose, standalone = false }: { onClose: () => void; standalone?: boolean }) {
  const { cart, loading, error, changeQuantity } = useCommerce();
  if (loading)
    return (
      <p className="py-10 text-center" role="status">
        در حال دریافت سبد خرید…
      </p>
    );
  if (!cart.length)
    return (
      <div className="space-y-5 py-10 text-center">
        <ShoppingBag size={44} strokeWidth={1} className="mx-auto text-[#9b5870]" />
        <p>هنوز محصولی به سبد اضافه نکرده‌اید.</p>
        <Link className="commerce-button" href="/shop" onClick={onClose}>
          دیدن محصولات
        </Link>
      </div>
    );
  return (
    <div className="space-y-5">
      {standalone && <h2 className="text-lg">انتخاب‌های تو <span className="text-sm text-[#8b777d]">({cart.reduce((sum, line) => sum + line.quantity, 0).toLocaleString("fa-IR")} کالا)</span></h2>}
      {cart.map((line) => (
        <div
          key={cartKey(line)}
          className="flex items-start gap-4 border-b border-[#eee3e5] pb-5"
        >
          {standalone && !line.design && line.image && <Link href="/shop" className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#faf5f3]"><Image src={line.image} alt={line.name} fill sizes="80px" className="object-contain" /></Link>}
          <div className="min-w-0 flex-1">
            {line.design && (
              <div className="mb-3 w-28">
                <SavedDesignPreview design={line.design} />
                <p className="mt-2 text-xs text-[#9b5870]">
                  طرح شخصی · {line.design.charms.length.toLocaleString("fa")}{" "}
                  چارم
                </p>
              </div>
            )}
            <p className="text-sm font-medium">{line.name}</p>
            {line.design_pending && (
              <p className="mt-2 text-xs leading-6 text-[#947247]">
                طرح به سبد اضافه شد؛ قیمت و موجودی آن پیش از ثبت سفارش با
                فروشگاه تأیید می‌شود.
              </p>
            )}
            {line.variation_label && (
              <p className="mt-2 text-xs text-[#8b777d]">
                {line.variation_label}
              </p>
            )}
            <p className="mt-2 text-sm">
              {line.design_pending
                ? "قیمت در انتظار تأیید فروشگاه"
                : money(line.price, "IRT")}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                aria-label={`افزایش تعداد ${line.name}`}
                className="commerce-quantity"
                disabled={line.quantity >= 99}
                onClick={() => changeQuantity(cartKey(line), 1)}
              >
                +
              </button>
              <span>{new Intl.NumberFormat("fa").format(line.quantity)}</span>
              <button
                type="button"
                aria-label={`کاهش تعداد ${line.name}`}
                className="commerce-quantity"
                onClick={() => changeQuantity(cartKey(line), -1)}
              >
                −
              </button>
              <button
                type="button"
                className="mr-auto text-xs text-[#9b5870]"
                onClick={() => changeQuantity(cartKey(line), -line.quantity)}
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-between text-sm">
        <span>جمع تقریبی کالاها</span>
        <strong>
          {cart.some(item => item.design_pending) ? "در انتظار تأیید قیمت طرح" : money(
            cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
            "IRT",
          )}
        </strong>
      </div>
      <p className="text-xs leading-6 text-[#8b777d]">
        مبلغ نهایی، تخفیف و هزینه ارسال در مرحله ثبت سفارش محاسبه می‌شود.
      </p>
      {error && (
        <p className="commerce-error" role="alert">
          {error}
        </p>
      )}
      <Link
        className="commerce-button w-full"
        href="/checkout"
        onClick={onClose}
      >
        ادامه و ثبت سفارش
      </Link>
    </div>
  );
}
