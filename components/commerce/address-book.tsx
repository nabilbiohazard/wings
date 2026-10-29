"use client";

import { useEffect, useState } from "react";
import { commerce } from "@/lib/commerce-client";
import { digits } from "@/lib/commerce-types";
import type { Address } from "@/lib/commerce-types";
import { useCommerce } from "./provider";
import { Check, MapPin, Package, Pencil, Plus, Trash2, X } from "lucide-react";
import styles from "./account-details.module.css";

const empty: Address = {
  id: "",
  label: "",
  first_name: "",
  last_name: "",
  phone: "",
  country: "IR",
  state: "",
  city: "",
  address_1: "",
  address_2: "",
  postcode: "",
};
export function AddressBook({
  selected,
  onSelect,
}: {
  selected?: string;
  onSelect?: (id: string) => void;
}) {
  const { customer } = useCommerce();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [states, setStates] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    Promise.all([
      commerce<{ addresses: Address[] }>("addresses"),
      commerce<{ states: Record<string, string> }>("locations"),
    ])
      .then(([list, locations]) => {
        if (active) {
          setAddresses(list.addresses);
          setStates(locations.states);
        }
      })
      .catch((reason) => {
        if (active) setError(reason.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [customer?.id]);
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;
    setBusy(true);
    setError("");
    try {
      const response = await commerce<{ addresses: Address[] }>(
        form.id ? `addresses/${form.id}` : "addresses",
        { ...form, postcode: digits(form.postcode), phone: digits(form.phone) },
        form.id ? "PATCH" : "POST",
      );
      setAddresses(response.addresses);
      setForm(null);
      setNotice("آدرست با موفقیت ذخیره شد.");
      const id =
        form.id || response.addresses[response.addresses.length - 1]?.id;
      if (id) onSelect?.(id);
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function remove(address: Address) {
    setBusy(true);
    setError("");
    try {
      const response = await commerce<{ addresses: Address[] }>(
        `addresses/${address.id}`,
        undefined,
        "DELETE",
      );
      setAddresses(response.addresses);
      setDeleting(null);
      setNotice("آدرس حذف شد.");
      if (selected === address.id) onSelect?.("");
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function field(
    name: keyof Address,
    label: string,
    required = true,
    extra: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) {
    return (
      <label className={styles.field}>
        {label}
        <input
          className={styles.input}
          value={form?.[name] || ""}
          required={required}
          maxLength={name === "address_1" ? 400 : 100}
          onChange={(event) =>
            setForm((current) =>
              current ? { ...current, [name]: event.target.value } : current,
            )
          }
          {...extra}
        />
      </label>
    );
  }
  return (
    <section className={styles.panel}>
      <div className={styles.heading}>
        <span className={styles.sectionIcon}>
          <MapPin size={22} aria-hidden="true" />
        </span>
        <div>
          <p className={styles.eyebrow} lang="en">
            JOY KNOWS THE WAY
          </p>
          <p className="text-sm leading-7 text-[#8b777d]">
            بستهٔ کوچک شادی‌ات را کجا بفرستیم؟
          </p>
        </div>
      </div>
      <div className={styles.addressToolbar}>
        <h2 className="text-lg font-medium">
          {onSelect ? "آدرس دریافت سفارش" : "آدرس‌های من"}
          {!loading && (
            <span
              className={styles.addressCount}
              aria-label={`${addresses.length} آدرس`}
            >
              {addresses.length.toLocaleString("fa-IR")}
            </span>
          )}
        </h2>
        <button
          type="button"
          className={styles.secondary}
          disabled={busy || loading}
          onClick={() =>
            setForm({
              ...empty,
              first_name: customer?.first_name || "",
              last_name: customer?.last_name || "",
              phone: customer?.phone || "",
            })
          }
        >
          <Plus size={16} /> آدرس جدید
        </button>
      </div>
      {loading ? (
        <p role="status" className="text-sm">
          در حال دریافت آدرس‌ها…
        </p>
      ) : (
        !addresses.length && (
          <p className={styles.emptyState}>
            <MapPin size={38} strokeWidth={1} />
            هنوز آدرسی ذخیره نکرده‌اید. برای ثبت سفارش، آدرس جدید اضافه کنید.
          </p>
        )
      )}
      {notice && (
        <p className={styles.success} role="status">
          <Check size={16} />
          {notice}
        </p>
      )}
      <div className={styles.addressGrid}>
        {addresses.map((address) => (
          <article
            key={address.id}
            className={styles.addressCard}
            data-selected={selected === address.id}
          >
            {onSelect ? (
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                <input
                  type="radio"
                  name="shipping-address"
                  checked={selected === address.id}
                  onChange={() => onSelect(address.id)}
                />
                {address.label}
              </label>
            ) : (
              <h3 className={styles.addressTitle}>
                <MapPin size={19} strokeWidth={1.3} />
                {address.label}
                <span lang="en">WINGS ADDRESS</span>
              </h3>
            )}
            <p className="mt-3 text-sm leading-7">
              {address.first_name} {address.last_name}
              <br />
              {states[address.state] || address.state}، {address.city}،{" "}
              {address.address_1}
              {address.address_2 && `، ${address.address_2}`}
            </p>
            <p className="mt-2 text-xs text-[#8b777d]">
              کد پستی: {address.postcode} · تماس: {address.phone}
            </p>
            <div className={styles.cardActions}>
              <button
                type="button"
                disabled={busy}
                onClick={() => setForm(address)}
              >
                <Pencil size={14} /> ویرایش
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => setDeleting(address.id)}
              >
                <Trash2 size={14} /> حذف آدرس
              </button>
            </div>
            {deleting === address.id && (
              <div
                className={styles.deleteConfirm}
                role="group"
                aria-label="تأیید حذف آدرس"
              >
                <p>این آدرس از دفترچه‌ات حذف شود؟</p>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void remove(address)}
                >
                  بله، حذف شود
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setDeleting(null)}
                >
                  انصراف
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
      {form && (
        <form onSubmit={save} className={styles.addressForm}>
          <h3 className={styles.formTitle}>
            <Package size={20} strokeWidth={1.3} />
            {form.id ? "ویرایش آدرس" : "افزودن آدرس"}
          </h3>
          <p className={styles.formHint}>
            جزئیات دقیق‌تر، رسیدن بسته‌ات را راحت‌تر می‌کند. همه فیلدها به‌جز
            توضیحات تکمیلی ضروری‌اند.
          </p>
          <fieldset className={styles.fieldset} disabled={busy}>
            <legend className={styles.srOnly}>جزئیات آدرس</legend>
            {field("label", "عنوان آدرس (مثلاً منزل)")}
            <div className={styles.formGrid}>
              {field("first_name", "نام گیرنده", true, {
                autoComplete: "given-name",
              })}
              {field("last_name", "نام خانوادگی گیرنده", true, {
                autoComplete: "family-name",
              })}
              {field("phone", "موبایل گیرنده", true, {
                type: "tel",
                dir: "ltr",
                autoComplete: "tel",
              })}
              <label className="commerce-label">
                استان
                <select
                  className={styles.input}
                  required
                  value={form.state}
                  onChange={(event) =>
                    setForm((current) =>
                      current
                        ? { ...current, state: event.target.value }
                        : null,
                    )
                  }
                >
                  <option value="">استان را انتخاب کنید</option>
                  {Object.entries(states).map(([code, label]) => (
                    <option key={code} value={code}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              {field("city", "شهر", true, { autoComplete: "address-level2" })}
              {field("postcode", "کد پستی ده‌رقمی", true, {
                inputMode: "numeric",
                dir: "ltr",
                autoComplete: "postal-code",
                maxLength: 10,
                pattern: "[0-9۰-۹٠-٩]{10}",
                title: "کد پستی باید دقیقاً ۱۰ رقم باشد",
              })}
            </div>
            {field("address_1", "آدرس کامل، خیابان و پلاک", true, {
              autoComplete: "address-line1",
            })}
            {field("address_2", "طبقه / واحد / توضیح تکمیلی", false, {
              autoComplete: "address-line2",
            })}
          </fieldset>
          <div className={styles.formFooter}>
            <button className={styles.primary} disabled={busy}>
              {busy ? "در حال ذخیره…" : "ذخیره آدرس"}
            </button>
            <button
              type="button"
              className={styles.secondary}
              disabled={busy}
              onClick={() => setForm(null)}
            >
              <X size={15} /> انصراف
            </button>
          </div>
        </form>
      )}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
