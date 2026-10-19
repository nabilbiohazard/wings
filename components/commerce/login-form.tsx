"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { commerce } from "@/lib/commerce-client";
import { digits, normalizePhone } from "@/lib/commerce-types";
import type { Customer } from "@/lib/commerce-types";
import { useCommerce } from "./provider";

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const { customer, loading, loggedIn } = useCommerce();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeLength, setCodeLength] = useState<number | null>(4);
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!seconds) return;
    const timer = setTimeout(
      () => setSeconds((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => clearTimeout(timer);
  }, [seconds]);
  async function send() {
    const normalized = normalizePhone(phone);
    if (!normalized) {
      setError("شماره موبایل معتبر وارد کنید؛ مانند ۰۹۱۲۱۲۳۴۵۶۷.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const result = await commerce<{
        retry_after: number;
        code_length?: number | null;
      }>("auth/request", {
        phone: normalized,
      });
      setPhone(normalized);
      setStep("code");
      setCode("");
      setCodeLength(
        result.code_length &&
          result.code_length >= 4 &&
          result.code_length <= 10
          ? result.code_length
          : null,
      );
      setSeconds(result.retry_after);
    } catch (failure) {
      setError((failure as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function verify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await commerce<{ customer: Customer }>("auth/verify", {
        code: digits(code),
      });
      await loggedIn(result.customer);
      onSuccess?.();
    } catch (failure) {
      setError((failure as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (loading)
    return (
      <p className="py-8 text-center text-sm" role="status">
        در حال بررسی حساب…
      </p>
    );
  if (customer)
    return (
      <div className="space-y-5 py-6 text-center">
        <p>خوش آمدید، {customer.first_name || customer.phone}</p>
        <Link href="/account" onClick={onSuccess} className="commerce-button">
          ورود به داشبورد
        </Link>
      </div>
    );
  return (
    <div className="mx-auto max-w-md space-y-5 py-4">
      <div>
        <h2 className="text-xl font-medium">ورود / ساخت حساب</h2>
        <p className="mt-3 text-sm leading-7 text-[#8b777d]">
          با شماره موبایل وارد شوید. اگر حساب ندارید، حساب شما پس از تأیید شماره
          ساخته می‌شود.
        </p>
      </div>
      {step === "phone" ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void send();
          }}
          className="space-y-4"
        >
          <label className="commerce-label">
            شماره موبایل
            <input
              className="commerce-input"
              type="tel"
              dir="ltr"
              autoComplete="tel"
              inputMode="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="09121234567"
              required
              maxLength={20}
            />
          </label>
          <button className="commerce-button w-full" disabled={busy}>
            {busy ? "در حال ارسال…" : "دریافت کد ورود"}
          </button>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-4">
          <p className="text-sm">
            کد پیامک‌شده به <b dir="ltr">{phone}</b> را وارد کنید.
          </p>
          <label className="commerce-label">
            کد ورود
            <input
              autoFocus
              className="commerce-input text-center tracking-[0.5em]"
              dir="ltr"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={codeLength || 10}
              value={code}
              onChange={(event) =>
                setCode(digits(event.target.value).replace(/\D/g, ""))
              }
              required
              pattern={codeLength ? `[0-9]{${codeLength}}` : "[0-9]{4,10}"}
            />
          </label>
          <button
            className="commerce-button w-full"
            disabled={
              busy ||
              (codeLength
                ? code.length !== codeLength
                : code.length < 4 || code.length > 10)
            }
          >
            {busy ? "در حال بررسی…" : "تأیید و ورود"}
          </button>
          <div className="flex justify-between gap-4 text-xs text-[#79465a]">
            <button
              type="button"
              disabled={busy || seconds > 0}
              onClick={() => void send()}
            >
              {seconds > 0
                ? `ارسال مجدد (${new Intl.NumberFormat("fa").format(seconds)} ثانیه)`
                : "ارسال مجدد کد"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setStep("phone");
                setCode("");
                setError("");
              }}
            >
              تغییر شماره
            </button>
          </div>
        </form>
      )}
      {error && (
        <p className="commerce-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
