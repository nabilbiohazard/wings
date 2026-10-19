"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HeaderBackdrop } from "@/components/header-backdrop";
import { useCommerce } from "./provider";
import { LoginForm } from "./login-form";
import { CommerceHero } from "./page-hero";
import {
  Package,
  MapPin,
  UserRound,
  LogOut,
  ShieldCheck,
  ChevronLeft,
  Heart,
} from "lucide-react";

export function AccountShell({ children }: { children: React.ReactNode }) {
  const { customer, loading, error, logout } = useCommerce();
  const pathname = usePathname();
  const [failure, setFailure] = useState("");
  return (
    <main className="commerce-page min-h-screen pb-20">
      <HeaderBackdrop />
      <div className="site-container py-10">
        <CommerceHero />
        {error && (
          <p className="commerce-error mb-5" role="alert">
            {error}
          </p>
        )}
        {loading ? (
          <p role="status" className="commerce-panel">
            در حال دریافت حساب…
          </p>
        ) : !customer ? (
          <div className="commerce-panel">
            <LoginForm />
          </div>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
            <aside className="commerce-panel commerce-account-sidebar">
              <div className="commerce-avatar" aria-hidden="true">
                {customer.first_name?.[0] || <UserRound size={26} />}
              </div>
              <p className="font-medium">
                {customer.first_name || "همراه وینگز"}
              </p>
              <span className="commerce-verified">
                <ShieldCheck size={13} aria-hidden="true" /> شماره تأیید شده
              </span>
              <p dir="ltr" className="mt-2 text-right text-sm text-[#8b777d]">
                {customer.phone}
              </p>
              <nav
                className="mt-6 flex flex-wrap gap-2 lg:flex-col"
                aria-label="حساب کاربری"
              >
                {[
                  {
                    href: "/account",
                    label: "داشبورد و سفارش‌ها",
                    icon: Package,
                  },
                  {
                    href: "/account/addresses",
                    label: "آدرس‌های من",
                    icon: MapPin,
                  },
                  {
                    href: "/account/profile",
                    label: "اطلاعات حساب",
                    icon: UserRound,
                  },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={
                      pathname === item.href ||
                      (item.href === "/account" &&
                        pathname.startsWith("/account/orders/"))
                        ? "page"
                        : undefined
                    }
                    className="commerce-account-link"
                  >
                    <item.icon size={18} aria-hidden="true" />
                    <span>{item.label}</span>
                    <ChevronLeft
                      size={14}
                      className="commerce-nav-chevron"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
                <button
                  type="button"
                  className="commerce-account-link commerce-logout"
                  onClick={async () => {
                    setFailure("");
                    try {
                      await logout();
                    } catch (reason) {
                      setFailure((reason as Error).message);
                    }
                  }}
                >
                  <LogOut size={17} aria-hidden="true" /> خروج از حساب
                </button>
              </nav>
              <div className="commerce-sidebar-note">
                <Heart size={17} aria-hidden="true" />
                <p>
                  جزئیات کوچک،
                  <br />
                  روزهای رنگی‌تر.
                </p>
                <Link href="/shop">یک انتخاب تازه ←</Link>
              </div>
              {failure && (
                <p role="alert" className="commerce-error mt-4">
                  {failure}
                </p>
              )}
            </aside>
            <div className="min-w-0">{children}</div>
          </div>
        )}
      </div>
    </main>
  );
}
