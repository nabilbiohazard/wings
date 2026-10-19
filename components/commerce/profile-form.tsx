"use client";
import { useState } from "react";
import { commerce } from "@/lib/commerce-client";
import type { Customer } from "@/lib/commerce-types";
import { useCommerce } from "./provider";
import { UserRound } from "lucide-react";

export function ProfileForm() {
  const { customer, updateCustomer } = useCommerce();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSaved(false);
    const data = new FormData(event.currentTarget);
    try {
      const result = await commerce<{ customer: Customer }>(
        "me",
        Object.fromEntries(data),
        "PATCH",
      );
      updateCustomer(result.customer);
      setSaved(true);
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="commerce-panel">
      <div className="commerce-section-intro mb-6">
        <span className="commerce-section-icon">
          <UserRound size={22} aria-hidden="true" />
        </span>
        <div>
          <p className="commerce-eyebrow" lang="en">
            A LITTLE ABOUT YOU
          </p>
          <p className="text-sm leading-7 text-[#8b777d]">
            با شناختن تو، همراهی‌مان قشنگ‌تر می‌شود.
          </p>
        </div>
      </div>
      <h2 className="mb-6 text-xl font-medium">اطلاعات حساب</h2>
      <form onSubmit={save} className="max-w-xl space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="commerce-label">
            نام
            <input
              className="commerce-input"
              name="first_name"
              required
              maxLength={80}
              autoComplete="given-name"
              defaultValue={customer?.first_name}
            />
          </label>
          <label className="commerce-label">
            نام خانوادگی
            <input
              className="commerce-input"
              name="last_name"
              required
              maxLength={80}
              autoComplete="family-name"
              defaultValue={customer?.last_name}
            />
          </label>
        </div>
        <label className="commerce-label">
          ایمیل دریافت اطلاعات سفارش
          <input
            className="commerce-input"
            type="email"
            name="email"
            dir="ltr"
            required
            maxLength={200}
            autoComplete="email"
            defaultValue={customer?.email}
          />
        </label>
        <label className="commerce-label">
          شماره موبایل تأییدشده
          <input
            className="commerce-input"
            dir="ltr"
            readOnly
            value={customer?.phone || ""}
          />
        </label>
        <button className="commerce-button" disabled={busy}>
          {busy ? "در حال ذخیره…" : "ذخیره اطلاعات"}
        </button>
        {saved && (
          <p className="text-sm text-emerald-700" role="status">
            اطلاعات حساب ذخیره شد.
          </p>
        )}
        {error && (
          <p className="commerce-error" role="alert">
            {error}
          </p>
        )}
      </form>
    </section>
  );
}
