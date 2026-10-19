"use client";

import { useEffect, useState } from "react";
import { commerce } from "@/lib/commerce-client";
import { digits } from "@/lib/commerce-types";
import type { Address } from "@/lib/commerce-types";
import { useCommerce } from "./provider";
import { MapPin } from "lucide-react";

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
      <label className="commerce-label">
        {label}
        <input
          className="commerce-input"
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
    <section className="commerce-panel space-y-5">
      <div className="commerce-section-intro">
        <span className="commerce-section-icon">
          <MapPin size={22} aria-hidden="true" />
        </span>
        <div>
          <p className="commerce-eyebrow" lang="en">
            JOY KNOWS THE WAY
          </p>
          <p className="text-sm leading-7 text-[#8b777d]">
            بستهٔ کوچک شادی‌ات را کجا بفرستیم؟
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-medium">
          {onSelect ? "آدرس دریافت سفارش" : "آدرس‌های من"}
        </h2>
        <button
          type="button"
          className="commerce-secondary"
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
          + آدرس جدید
        </button>
      </div>
      {loading ? (
        <p role="status" className="text-sm">
          در حال دریافت آدرس‌ها…
        </p>
      ) : (
        !addresses.length && (
          <p className="text-sm leading-7 text-[#8b777d]">
            هنوز آدرسی ذخیره نکرده‌اید. برای ثبت سفارش، آدرس جدید اضافه کنید.
          </p>
        )
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {addresses.map((address) => (
          <article
            key={address.id}
            className={`rounded-2xl border p-4 ${selected === address.id ? "border-[#9b5870] bg-[#fff5f8]" : "border-[#eee3e5]"}`}
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
              <h3 className="text-sm font-medium">{address.label}</h3>
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
            <div className="mt-4 flex gap-4 text-xs text-[#79465a]">
              <button
                type="button"
                disabled={busy}
                onClick={() => setForm(address)}
              >
                ویرایش
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void remove(address)}
              >
                حذف آدرس
              </button>
            </div>
          </article>
        ))}
      </div>
      {form && (
        <form
          onSubmit={save}
          className="space-y-4 rounded-2xl border border-[#e7dadd] bg-[#fffafb] p-4"
        >
          <h3 className="font-medium">
            {form.id ? "ویرایش آدرس" : "افزودن آدرس"}
          </h3>
          {field("label", "عنوان آدرس (مثلاً منزل)")}
          <div className="grid gap-4 sm:grid-cols-2">
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
                className="commerce-input"
                required
                value={form.state}
                onChange={(event) =>
                  setForm((current) =>
                    current ? { ...current, state: event.target.value } : null,
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
            })}
          </div>
          {field("address_1", "آدرس کامل، خیابان و پلاک", true, {
            autoComplete: "address-line1",
          })}
          {field("address_2", "طبقه / واحد / توضیح تکمیلی", false, {
            autoComplete: "address-line2",
          })}
          <div className="flex gap-3">
            <button className="commerce-button" disabled={busy}>
              {busy ? "در حال ذخیره…" : "ذخیره آدرس"}
            </button>
            <button
              type="button"
              className="commerce-secondary"
              disabled={busy}
              onClick={() => setForm(null)}
            >
              انصراف
            </button>
          </div>
        </form>
      )}
      {error && (
        <p className="commerce-error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
