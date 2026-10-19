"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { HeaderBackdrop } from "@/components/header-backdrop";
import { commerce } from "@/lib/commerce-client";
import { cartKey, cartPayload, money } from "@/lib/commerce-types";
import { SavedDesignPreview } from "../custom-design/SavedDesignPreview";
import type { CheckoutInput, Order, Quote } from "@/lib/commerce-types";
import { AddressBook } from "./address-book";
import { LoginForm } from "./login-form";
import { useCommerce } from "./provider";
import { CommerceHero } from "./page-hero";

type PendingRequest = {
  quote_id: string;
  idempotency_key: string;
  owner: number;
};
const pendingStorage = "wings-pending-order";
export function Checkout() {
  const { customer, cart, loading, clearCart, changeQuantity } = useCommerce();
  const [address, setAddress] = useState("");
  const [coupon, setCoupon] = useState("");
  const [note, setNote] = useState("");
  const [shipping, setShipping] = useState<string[]>([]);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quotedInput, setQuotedInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [pending, setPending] = useState<PendingRequest | null>(null);
  const locked = useRef(false);
  const input: CheckoutInput = {
    items: cart.map(cartPayload),
    address_id: address,
    coupon,
    shipping_methods: shipping,
    note,
  };
  const signature = JSON.stringify(input);
  const currentQuote = quote && quotedInput === signature ? quote : null;
  useEffect(() => {
    // A lost HTTP response must not cause another order when the checkout is reloaded.
    Promise.resolve().then(() => {
      try {
        const stored = JSON.parse(
          sessionStorage.getItem(pendingStorage) || "null",
        );
        if (
          stored &&
          stored.owner === customer?.id &&
          /^[a-f0-9]{48}$/.test(stored.quote_id) &&
          /^[a-f0-9-]{36}$/.test(stored.idempotency_key)
        )
          setPending(stored);
      } catch {
        /* Ignore invalid storage. */
      }
    });
  }, [customer?.id]);
  async function calculate() {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    setError("");
    try {
      const result = await commerce<Quote>("checkout/quote", input);
      const selected = result.shipping.map((item) => item.selected);
      setShipping(selected);
      setQuotedInput(JSON.stringify({ ...input, shipping_methods: selected }));
      setQuote(result);
    } catch (reason) {
      setQuote(null);
      setError((reason as Error).message);
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }
  function complete(result: Order) {
    setOrder(result);
    setPending(null);
    sessionStorage.removeItem(pendingStorage);
    if (!["failed", "cancelled"].includes(result.status)) clearCart();
  }
  async function submit() {
    if (locked.current || (!currentQuote && !pending)) return;
    locked.current = true;
    setBusy(true);
    setError("");
    const request = pending || {
      quote_id: currentQuote!.id,
      idempotency_key: crypto.randomUUID(),
      owner: customer!.id,
    };
    setPending(request);
    try {
      // Persist before sending: if storage is blocked, leave the existing order request in memory.
      try {
        sessionStorage.setItem(pendingStorage, JSON.stringify(request));
      } catch {
        /* Memory still prevents double clicks. */
      }
      const result = await commerce<{ order: Order }>(
        "checkout/order",
        request,
      );
      complete(result.order);
    } catch (reason) {
      const rejected = reason as Error & { status?: number };
      // These bridge errors are returned before order creation. A new quote
      // must use a new request; ambiguous failures retain the recovery token.
      if (
        rejected.status === 409 &&
        /^(تغییر در |پیش‌فاکتور |قیمت، طرح، آدرس)/.test(rejected.message)
      ) {
        setPending(null);
        setQuote(null);
        setQuotedInput("");
        try {
          sessionStorage.removeItem(pendingStorage);
        } catch {
          /* State still permits recalculation when storage is unavailable. */
        }
      }
      setError((reason as Error).message);
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }
  async function recover() {
    if (!pending || locked.current) return;
    locked.current = true;
    setBusy(true);
    setError("");
    try {
      const result = await commerce<{ order: Order | null; pending: boolean }>(
        `checkout/requests/${pending.idempotency_key}`,
      );
      if (result.order) complete(result.order);
      else if (result.pending)
        setError(
          "درخواست سفارش دریافت شده است و نیاز به بررسی دارد؛ سفارش‌ها را بررسی کنید یا با پشتیبانی تماس بگیرید.",
        );
      else {
        setPending(null);
        sessionStorage.removeItem(pendingStorage);
        setQuote(null);
        setError(
          "سفارشی برای این درخواست ثبت نشده است؛ دوباره مبلغ را محاسبه و سفارش را ثبت کنید.",
        );
      }
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }
  return (
    <main className="commerce-page min-h-screen pb-20">
      <HeaderBackdrop />
      <div className="site-container py-10">
        <CommerceHero checkout />
        <ol className="commerce-checkout-steps" aria-label="مراحل سفارش">
          {["ورود به حساب", "آدرس و جزئیات", "ثبت و پیگیری"].map(
            (label, index) => (
              <li
                key={label}
                aria-current={
                  (!customer ? index === 0 : order ? index === 2 : index === 1)
                    ? "step"
                    : undefined
                }
              >
                <span>{(index + 1).toLocaleString("fa")}</span>
                {label}
              </li>
            ),
          )}
        </ol>
        {loading ? (
          <p role="status" className="commerce-panel">
            در حال دریافت حساب و سبد خرید…
          </p>
        ) : !customer ? (
          <div className="commerce-panel">
            <LoginForm />
            <p className="text-center text-sm text-[#8b777d]">
              برای ثبت سفارش وارد حساب شخصی خود شوید.
            </p>
          </div>
        ) : order ? (
          <section className="commerce-panel space-y-5 text-center">
            <div className="text-4xl text-emerald-700" aria-hidden="true">
              ✓
            </div>
            <h2 className="text-2xl font-medium">
              {["failed", "cancelled"].includes(order.status)
                ? `وضعیت سفارش #${order.number}: ${order.status_label}`
                : `سفارش #${order.number} ثبت شد`}
            </h2>
            <p className="text-sm leading-7">
              {["failed", "cancelled"].includes(order.status)
                ? "این سفارش تکمیل نشده یا لغو شده است. جزئیات آن را بررسی کنید؛ سبد خرید شما محفوظ است."
                : "سفارش شما برای بررسی فروشگاه ثبت شد. در این مرحله پرداختی انجام نشده است."}
            </p>
            <p>{money(order.total, order.currency)}</p>
            <Link
              className="commerce-button"
              href={`/account/orders/${order.id}`}
            >
              مشاهده و پیگیری سفارش
            </Link>
          </section>
        ) : pending ? (
          <section className="commerce-panel space-y-5">
            <h2 className="text-xl font-medium">بررسی نتیجه ثبت سفارش</h2>
            <p className="text-sm leading-7">
              درخواست ثبت سفارش ارسال شده است. ابتدا نتیجه همین درخواست را بررسی
              کنید.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                className="commerce-button"
                disabled={busy}
                onClick={() => void recover()}
              >
                {busy ? "در حال بررسی…" : "بررسی نتیجه سفارش"}
              </button>
              <button
                className="commerce-secondary"
                disabled={busy}
                onClick={() => void submit()}
              >
                تلاش مجدد با همان درخواست
              </button>
              <Link className="commerce-secondary" href="/account">
                سفارش‌های من
              </Link>
            </div>
            {error && (
              <p className="commerce-error" role="alert">
                {error}
              </p>
            )}
          </section>
        ) : !cart.length ? (
          <section className="commerce-panel space-y-5 text-center">
            <p>سبد خرید شما خالی است.</p>
            <Link href="/shop" className="commerce-button">
              رفتن به فروشگاه
            </Link>
          </section>
        ) : !customer.email ? (
          <section className="commerce-panel space-y-5">
            <h2 className="text-xl">تکمیل اطلاعات حساب</h2>
            <p className="text-sm leading-7">
              برای دریافت اطلاعات سفارش، نام و ایمیل خود را تکمیل کنید. سبد خرید
              شما محفوظ می‌ماند.
            </p>
            <Link className="commerce-button" href="/account/profile">
              تکمیل اطلاعات حساب
            </Link>
          </section>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-6">
              <AddressBook
                selected={address}
                onSelect={(id) => {
                  setAddress(id);
                  setQuote(null);
                  setShipping([]);
                }}
              />
              <section className="commerce-panel space-y-4">
                <label className="commerce-label">
                  کد تخفیف (اختیاری)
                  <input
                    className="commerce-input"
                    value={coupon}
                    maxLength={100}
                    disabled={busy}
                    onChange={(event) => setCoupon(event.target.value)}
                  />
                </label>
                <label className="commerce-label">
                  توضیحات سفارش (اختیاری)
                  <textarea
                    className="commerce-input min-h-24"
                    value={note}
                    maxLength={1000}
                    disabled={busy}
                    onChange={(event) => setNote(event.target.value)}
                  />
                </label>
              </section>
              {quote && (
                <section className="commerce-panel space-y-4">
                  <h2 className="text-lg font-medium">روش ارسال</h2>
                  {quote.shipping.length ? (
                    quote.shipping.map((pack) => (
                      <fieldset key={pack.package} className="space-y-3">
                        <legend className="mb-3 text-sm">{pack.name}</legend>
                        {pack.rates.map((rate) => (
                          <label
                            key={rate.id}
                            className="flex items-center gap-3 text-sm"
                          >
                            <input
                              type="radio"
                              name={`shipping-${pack.package}`}
                              checked={shipping[pack.package] === rate.id}
                              disabled={busy}
                              onChange={() =>
                                setShipping((current) => {
                                  const next = [...current];
                                  next[pack.package] = rate.id;
                                  return next;
                                })
                              }
                            />
                            {rate.label} — {money(rate.cost, quote.currency)}
                          </label>
                        ))}
                      </fieldset>
                    ))
                  ) : (
                    <p className="text-sm">این سفارش نیاز به ارسال ندارد.</p>
                  )}
                </section>
              )}
            </div>
            <aside className="commerce-panel space-y-5 lg:sticky lg:top-44">
              <h2 className="text-lg font-medium">خلاصه سفارش</h2>
              <div className="divide-y divide-[#eee3e5]">
                {cart.map((item) => (
                  <div key={cartKey(item)} className="space-y-3 py-4">
                    {item.design && (
                      <div className="w-28">
                        <SavedDesignPreview design={item.design} />
                        <p className="mt-2 text-xs text-[#9b5870]">
                          همین طرح ·{" "}
                          {item.design.charms.length.toLocaleString("fa")} چارم
                        </p>
                      </div>
                    )}
                    <p className="text-sm font-medium">{item.name}</p>
                    {item.variation_label && (
                      <p className="text-xs text-[#8b777d]">
                        {item.variation_label}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span>{money(item.price * item.quantity, "IRT")}</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="commerce-quantity"
                          disabled={busy || item.quantity >= 99}
                          aria-label={`افزایش تعداد ${item.name}`}
                          onClick={() => changeQuantity(cartKey(item), 1)}
                        >
                          +
                        </button>
                        <span>{item.quantity.toLocaleString("fa")}</span>
                        <button
                          type="button"
                          className="commerce-quantity"
                          disabled={busy}
                          aria-label={`کاهش تعداد ${item.name}`}
                          onClick={() => changeQuantity(cartKey(item), -1)}
                        >
                          −
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {currentQuote && (
                <dl className="space-y-3 text-sm">
                  {[
                    ["جمع کالاها", currentQuote.subtotal],
                    ["تخفیف", currentQuote.discount],
                    ["هزینه ارسال", currentQuote.shipping_total],
                    ["مالیات", currentQuote.tax],
                    ["مبلغ نهایی سفارش", currentQuote.total],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4">
                      <dt>{label}</dt>
                      <dd>{money(value, currentQuote.currency)}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <p className="rounded-xl bg-[#fff4dc] p-4 text-xs leading-6">
                سفارش فعلاً بدون پرداخت آنلاین ثبت می‌شود و برای بررسی به
                فروشگاه ارسال خواهد شد.
              </p>
              {error && (
                <p className="commerce-error" role="alert">
                  {error}
                </p>
              )}
              {currentQuote ? (
                <button
                  className="commerce-button w-full"
                  disabled={busy}
                  onClick={() => void submit()}
                >
                  {busy ? "در حال ثبت…" : "ثبت سفارش بدون پرداخت"}
                </button>
              ) : (
                <button
                  className="commerce-button w-full"
                  disabled={busy || !address}
                  onClick={() => void calculate()}
                >
                  {busy ? "در حال محاسبه…" : "محاسبه مبلغ و هزینه ارسال"}
                </button>
              )}
              <Link
                href="/shop"
                className="block text-center text-xs text-[#79465a]"
              >
                ادامه خرید
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
