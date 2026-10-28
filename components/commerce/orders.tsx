"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { commerce } from "@/lib/commerce-client";
import { money } from "@/lib/commerce-types";
import type { Order } from "@/lib/commerce-types";
import { useCommerce } from "./provider";
import { Package, ArrowUpLeft, Heart } from "lucide-react";
import { SavedDesignPreview } from "../custom-design/SavedDesignPreview";
import { useShop } from "../shop-provider";
import { useSavedDesigns } from "@/lib/saved-designs";
import { Sparkles } from "lucide-react";
import styles from "./account.module.css";

export function OrderList({overview = false}: {overview?: boolean} = {}) {
  const { customer } = useCommerce();
  const {favorites, openPanel}=useShop();
  const designs=useSavedDesigns();
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await commerce<{
          orders: Order[];
          pages: number;
          total: number;
        }>(`orders?page=${page}`);
        if (active) {
          setOrders(data.orders);
          setPages(data.pages);
          setTotal(data.total);
        }
      } catch (reason) {
        if (active) setError((reason as Error).message);
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [page, customer?.id]);
  return (
    <>
    {overview && <div className={styles.stats} aria-label="خلاصهٔ حساب"><a href="#account-orders"><span className={styles.statIcon}><Package size={21} strokeWidth={1.3} /></span><div><strong>{loading || error ? "—" : total.toLocaleString("fa-IR")}</strong><span>سفارش‌های من</span></div><ArrowUpLeft size={16} /></a><button type="button" onClick={()=>openPanel("wishlist")}><span className={styles.statIcon}><Heart size={21} strokeWidth={1.3} /></span><div><strong>{favorites.length.toLocaleString("fa-IR")}</strong><span>علاقه‌مندی‌ها</span></div><ArrowUpLeft size={16} /></button><a href="#saved-designs-title"><span className={styles.statIcon}><Sparkles size={21} strokeWidth={1.3} /></span><div><strong>{designs.length.toLocaleString("fa-IR")}</strong><span>طرح‌های ذخیره‌شده</span></div><ArrowUpLeft size={16} /></a></div>}
    <section id="account-orders" className={`commerce-panel space-y-6 ${styles.orders}`}>
      <div className="commerce-section-intro">
        <span className="commerce-section-icon">
          <Package size={22} aria-hidden="true" />
        </span>
        <div>
          <p className="commerce-eyebrow" lang="en">
            YOUR PICKS, YOUR STORIES
          </p>
          <p className="text-sm leading-7 text-[#8b777d]">
            از اولین انتخاب تا رسیدن بسته، اینجا همراهت هستیم.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap justify-between gap-4">
        <h2 className="text-xl font-medium">سفارش‌های من</h2>
        <span className="text-sm text-[#8b777d]">
          {new Intl.NumberFormat("fa").format(total)} سفارش
        </span>
      </div>
      {!customer?.email && (
        <p className="rounded-xl bg-[#fff4dc] p-4 text-sm leading-7">
          برای ثبت اولین سفارش،{" "}
          <Link className="underline" href="/account/profile">
            نام و ایمیل خود را تکمیل کنید
          </Link>
          .
        </p>
      )}
      {loading ? (
        <p role="status">در حال دریافت سفارش‌ها…</p>
      ) : error ? (
        <p role="alert" className="commerce-error">
          {error}
        </p>
      ) : !orders.length ? (
        <div className="space-y-5 py-8 text-center">
          <div className="commerce-empty-icon">
            <Heart size={30} aria-hidden="true" />
          </div>
          <p>هنوز سفارشی ثبت نکرده‌اید.</p>
          <Link href="/shop" className="commerce-button">
            شروع خرید
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="commerce-order-card"
            >
              <span className="commerce-order-icon">
                <Package size={20} aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-medium">سفارش #{order.number}</h3>
                <p className="mt-2 text-xs text-[#8b777d]">
                  {new Date(order.created).toLocaleDateString("fa-IR")}
                </p>
              </div>
              <span
                className="commerce-order-status"
                data-status={order.status}
              >
                {order.status_label}
              </span>
              <strong className="text-sm">
                {money(order.total, order.currency)}
              </strong>
              <span className="commerce-order-arrow">
                <ArrowUpLeft size={18} aria-hidden="true" />
                <span className="sr-only">جزئیات</span>
              </span>
            </Link>
          ))}
        </div>
      )}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-4 text-sm">
          <button
            className="commerce-secondary"
            disabled={loading || page <= 1}
            onClick={() => setPage((value) => value - 1)}
          >
            قبلی
          </button>
          <span>
            {page.toLocaleString("fa")} / {pages.toLocaleString("fa")}
          </span>
          <button
            className="commerce-secondary"
            disabled={loading || page >= pages}
            onClick={() => setPage((value) => value + 1)}
          >
            بعدی
          </button>
        </div>
      )}
    </section>
    </>
  );
}

export function OrderDetail({ id }: { id: string }) {
  const { customer } = useCommerce();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  useEffect(() => {
    let active = true;
    commerce<{ order: Order }>(`orders/${id}`)
      .then((data) => {
        if (active) setOrder(data.order);
      })
      .catch((reason) => {
        if (active) setError(reason.message);
      });
    return () => {
      active = false;
    };
  }, [id, customer?.id]);
  async function cancel() {
    setBusy(true);
    setError("");
    try {
      const result = await commerce<{ order: Order }>(
        `orders/${id}/cancel`,
        {},
      );
      setOrder(result.order);
      setConfirmCancel(false);
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (!order)
    return (
      <div className="commerce-panel">
        {error ? (
          <p role="alert" className="commerce-error">
            {error}
          </p>
        ) : (
          <p role="status">در حال دریافت سفارش…</p>
        )}
      </div>
    );
  return (
    <section className="commerce-panel space-y-6">
      <Link href="/account" className="text-sm text-[#79465a]">
        → همه سفارش‌ها
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-medium">سفارش #{order.number}</h2>
        <span className="rounded-full bg-[#f8eef1] px-4 py-2 text-sm">
          {order.status_label}
        </span>
      </div>
      <p className="text-sm text-[#8b777d]">
        تاریخ ثبت: {new Date(order.created).toLocaleDateString("fa-IR")} ·{" "}
        {order.payment_title}
      </p>
      {order.payment_title === "ثبت سفارش بدون پرداخت آنلاین" && (
        <p className="rounded-xl bg-[#fff4dc] p-4 text-sm leading-7">
          این سفارش بدون پرداخت آنلاین ثبت شده است. فروشگاه وضعیت بررسی و
          آماده‌سازی آن را اعلام می‌کند.
        </p>
      )}
      <div className="divide-y divide-[#eee3e5]">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between gap-4 py-4">
            <div>
              <p className="font-medium">{item.name}</p>
              {item.design && (
                <div className="mt-3 max-w-64">
                  <SavedDesignPreview design={item.design} />
                  <p className="mt-2 text-xs text-[#9b5870]">
                    نسخهٔ ثبت‌شدهٔ طرح شما ·{" "}
                    {item.design.charms.length.toLocaleString("fa")} چارم
                  </p>
                </div>
              )}
              {item.design_component && (
                <p className="mt-2 text-xs text-[#9b5870]">
                  چارم متعلق به طرح شخصی
                </p>
              )}
              <p className="mt-2 text-xs text-[#8b777d]">
                تعداد: {item.quantity.toLocaleString("fa")}{" "}
                {item.attributes.join(" · ")}
              </p>
            </div>
            <p className="shrink-0 text-sm">
              {money(item.total, order.currency)}
            </p>
          </div>
        ))}
      </div>
      <dl className="ml-auto max-w-sm space-y-3 text-sm">
        {[
          ["جمع کالاها", order.subtotal],
          ["تخفیف", order.discount],
          ["ارسال", order.shipping_total],
          ["مالیات", order.tax],
          ["مبلغ سفارش", order.total],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-6">
            <dt>{label}</dt>
            <dd>{money(value, order.currency)}</dd>
          </div>
        ))}
      </dl>
      <div className="rounded-2xl border border-[#eee3e5] p-5">
        <h3 className="font-medium">آدرس ارسال</h3>
        <p className="mt-3 text-sm leading-7">
          {order.shipping.first_name} {order.shipping.last_name}
          <br />
          {order.shipping.city}، {order.shipping.address_1}{" "}
          {order.shipping.address_2}
          <br />
          کد پستی: {order.shipping.postcode}
        </p>
      </div>
      {order.customer_note && (
        <div>
          <h3 className="font-medium">توضیحات شما</h3>
          <p className="mt-2 text-sm leading-7">{order.customer_note}</p>
        </div>
      )}
      <div>
        <h3 className="font-medium">پیام‌ها و پیگیری سفارش</h3>
        {order.notes.length ? (
          <ul className="mt-4 space-y-3">
            {order.notes.map((note) => (
              <li
                key={note.id}
                className="rounded-xl bg-[#faf5f6] p-4 text-sm leading-7"
              >
                <p>{note.note}</p>
                <time className="text-xs text-[#8b777d]">
                  {new Date(note.created).toLocaleDateString("fa-IR")}
                </time>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-[#8b777d]">
            هنوز پیام جدیدی از فروشگاه ثبت نشده است.
          </p>
        )}
      </div>
      {order.can_cancel ? (
        <div>
          {confirmCancel ? (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm">از لغو سفارش مطمئن هستید؟</p>
              <button
                className="commerce-button"
                disabled={busy}
                onClick={() => void cancel()}
              >
                بله، لغو سفارش
              </button>
              <button
                className="commerce-secondary"
                disabled={busy}
                onClick={() => setConfirmCancel(false)}
              >
                انصراف
              </button>
            </div>
          ) : (
            <button
              className="commerce-secondary"
              onClick={() => setConfirmCancel(true)}
            >
              لغو سفارش
            </button>
          )}
        </div>
      ) : (
        <p className="text-sm text-[#8b777d]">
          برای تغییر یا لغو سفارش،{" "}
          <Link href="/contact" className="underline">
            با پشتیبانی تماس بگیرید
          </Link>
          .
        </p>
      )}
      {error && (
        <p role="alert" className="commerce-error">
          {error}
        </p>
      )}
    </section>
  );
}
