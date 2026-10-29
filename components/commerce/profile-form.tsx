"use client";
import { useState } from "react";
import { commerce } from "@/lib/commerce-client";
import type { Customer } from "@/lib/commerce-types";
import { useCommerce } from "./provider";
import {
  ArrowUpLeft,
  Check,
  Flower2,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import styles from "./account-details.module.css";

export function ProfileForm() {
  const { customer, updateCustomer } = useCommerce();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const completedFields = [
    customer?.first_name,
    customer?.last_name,
    customer?.email,
    customer?.phone,
  ].filter(Boolean).length;
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
    <div className={styles.details}>
      <section className={styles.identityBanner}>
        <span className={styles.monogram}>
          {customer?.first_name?.[0] || <UserRound size={30} />}
        </span>
        <div>
          <p className={styles.eyebrow} lang="en">
            A LITTLE MORE YOU
          </p>
          <h2>
            {[customer?.first_name, customer?.last_name]
              .filter(Boolean)
              .join(" ") || "همراه عزیز وینگز"}
          </h2>
          <p>جزئیات کوچک، برای یک همراهی قشنگ‌تر.</p>
        </div>
        <span className={styles.verified}>
          <ShieldCheck size={15} /> شماره تأییدشده
        </span>
      </section>
      <div className={styles.profileLayout}>
        <section className={styles.panel}>
          <div className={styles.heading}>
            <span className={styles.sectionIcon}>
              <UserRound size={22} aria-hidden="true" />
            </span>
            <div>
              <p className={styles.eyebrow} lang="en">
                A LITTLE ABOUT YOU
              </p>
              <p className="text-sm leading-7 text-[#8b777d]">
                با شناختن تو، همراهی‌مان قشنگ‌تر می‌شود.
              </p>
            </div>
          </div>
          <h2 className="mb-6 text-xl font-medium">اطلاعات حساب</h2>
          <form
            onSubmit={save}
            className={styles.profileForm}
            onChange={() => setSaved(false)}
          >
            <div className={styles.formGrid}>
              <label className={styles.field}>
                نام
                <input
                  className={styles.input}
                  name="first_name"
                  required
                  maxLength={80}
                  autoComplete="given-name"
                  defaultValue={customer?.first_name}
                />
              </label>
              <label className={styles.field}>
                نام خانوادگی
                <input
                  className={styles.input}
                  name="last_name"
                  required
                  maxLength={80}
                  autoComplete="family-name"
                  defaultValue={customer?.last_name}
                />
              </label>
            </div>
            <label className={styles.field}>
              ایمیل دریافت اطلاعات سفارش
              <input
                className={styles.input}
                type="email"
                name="email"
                dir="ltr"
                required
                maxLength={200}
                autoComplete="email"
                defaultValue={customer?.email}
              />
            </label>
            <label className={styles.field}>
              شماره موبایل تأییدشده
              <input
                className={styles.input}
                dir="ltr"
                readOnly
                value={customer?.phone || ""}
              />
            </label>
            <button className={styles.primary} disabled={busy}>
              <Check size={16} aria-hidden="true" />
              {busy ? "در حال ذخیره…" : "ذخیره اطلاعات"}
            </button>
            {saved && (
              <p className={styles.success} role="status">
                اطلاعات حساب ذخیره شد.
              </p>
            )}
            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}
          </form>
          <div className={styles.profileProgress}>
            <div>
              <span>تکمیل اطلاعات حساب</span>
              <span>{(completedFields * 25).toLocaleString("fa-IR")}٪</span>
            </div>
            <progress
              value={completedFields}
              max={4}
              aria-label="تکمیل اطلاعات حساب"
            />
          </div>
          <p className={styles.privacy}>
            <LockKeyhole size={14} /> شماره موبایل، شناسه ورود تو است و در این
            فرم قابل تغییر نیست.
          </p>
        </section>
        <aside className={styles.sideNotes}>
          <section className={styles.editorial}>
            <Flower2 size={42} strokeWidth={0.8} />
            <p lang="en" dir="ltr">
              Little details.
              <br />
              <em>Lovely connections.</em>
            </p>
            <span>
              یک آشنایی کوچک،
              <br />
              یک همراهی دوست‌داشتنی.
            </span>
          </section>
          <section className={styles.noteCard}>
            <h3>
              <Check size={17} /> قدم بعدی، مقصد تو
            </h3>
            <p>
              آدرس‌هایت را ثبت کن تا هنگام خرید، فقط به انتخاب دوست‌داشتنی بعدی
              فکر کنی.
            </p>
            <Link href="/account/addresses">
              آدرس‌های من <ArrowUpLeft size={16} />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
