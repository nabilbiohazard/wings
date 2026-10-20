"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { Icon } from "./icon";
import { useShop } from "./shop-provider";
import { Wordmark } from "./wordmark";
import { getHeaderColor } from "@/lib/header-theme";
import { useSavedDesigns } from "@/lib/saved-designs";

const links = [
  { name: "وینگز", href: "/" },
  { name: "فروشگاه", href: "/shop" },
  { name: "خودت بساز", href: "/custom-design" },
  { name: "کالکشن‌ها", href: "/collections" },
  { name: "درباره ما", href: "/about" },
  { name: "مجله وینگز", href: "/blog" },
  { name: "تماس با ما", href: "/contact" },
];

const shopCategories = [
  { name: "چارم", slug: "charms" },
  { name: "گردنبند", slug: "necklace" },
  { name: "دستبند", slug: "bracelet" },
  { name: "گوشواره", slug: "earrings" },
  { name: "انگشتر", slug: "rings" },
  { name: "پیرسینگ", slug: "piercing" },
  { name: "پوشاک", slug: "clothing" },
];

function CountBadge({ children, solid }: { children: number; solid: boolean }) {
  if (!children) return null;

  return (
    <span
      className={`
        absolute -right-1.5 -top-1.5
        flex h-4.25 min-w-4.25
        items-center justify-center
        rounded-full px-1
        text-[9px] font-medium
        shadow-sm
        transition-all duration-500
        ${solid ? "bg-black text-white" : "bg-white text-black"}
      `}
    >
      {children}
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const updateHeight = () => {
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${header.getBoundingClientRect().height}px`,
      );
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  const { openPanel, favorites, cart, products, setCategory } = useShop();
  const savedDesigns = useSavedDesigns();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const solid = scrolled || mobileOpen;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMobileOpen(false));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        ref={headerRef}
        style={{ WebkitTapHighlightColor: "rgba(247, 201, 220, 0.3)" }}
        className={`
          fixed left-0 top-0 z-100
          w-full
          transition-all duration-500
          ${solid ? "text-black" : "text-white"}
        `}
      >
        {/* BACKGROUND */}

        <div
          style={{ backgroundColor: solid || pathname === "/" ? undefined : `var(--route-header-background, ${getHeaderColor(pathname)})` }}
          className={`
            absolute inset-0
            transition-all duration-500
            ${
              solid
                ? `
                  bg-white/94
                  shadow-[0_10px_45px_rgba(0,0,0,0.045)]
                  backdrop-blur-2xl
                `
                : `
                  ${pathname === "/" ? "bg-transparent" : "backdrop-blur-[2px]"}
                `
            }
          `}
        />

        <div className="relative mx-auto site-container  ">
          {/* ========================
              TOP AREA
          ======================== */}

          <div
            className="
              flex flex-col
              gap-3
              py-4
              md:h-20.5
              md:flex-row
              md:items-center
              md:justify-between
              md:gap-8
              md:py-0
            "
          >
            {/* LOGO */}

            <div className="flex w-full justify-center md:w-auto md:justify-start">
              <Wordmark />
            </div>

            {/* DESKTOP SEARCH */}

            <button
              type="button"
              onClick={() => openPanel("search")}
              className={`
                group
                hidden h-11.5
                w-82.5
                items-center gap-4
                rounded-full
                border
                px-5
                text-sm
                transition-all duration-300
                lg:flex
                ${
                  solid
                    ? `
                      border-black/8
                      bg-black/2.5
                      text-black
                      hover:border-black/20
                      hover:bg-black/4.5
                    `
                    : `
                      border-white/18
                      bg-white/[0.07]
                      text-white
                      backdrop-blur-xl
                      hover:border-white/35
                      hover:bg-white/12
                    `
                }
              `}
            >
              <span
                className="
                  transition-transform duration-300
                  group-hover:scale-110
                "
              >
                <Icon name="search" size={18} />
              </span>

              <span
                className={`
                  flex-1 text-right
                  transition-opacity duration-300
                  ${solid ? "text-black/45" : "text-white/60"}
                `}
              >
                جستجو در محصولات...
              </span>

              <span
                dir="ltr"
                className={`
                  text-[9px]
                  tracking-[1.5px]
                  ${solid ? "text-black/20" : "text-white/25"}
                `}
              >
                SEARCH
              </span>
            </button>

            {/* ACTIONS */}

            <div className="flex w-full items-center justify-center md:w-auto md:justify-end">
              <div
                className={`
                  flex items-center
                  gap-1
                  rounded-full
                  border
                  p-1.5
                  transition-all duration-500
                  ${
                    solid
                      ? `
                        border-black/[0.07]
                        bg-black/2.5
                      `
                      : `
                        border-white/16
                        bg-white/[0.07]
                        backdrop-blur-xl
                      `
                  }
                `}
              >
                {/* MOBILE MENU */}

                <button
                  type="button"
                  aria-label="منو"
                  onClick={() => setMobileOpen((prev) => !prev)}
                  className={`
                    flex h-9 w-9
                    items-center justify-center
                    rounded-full
                    transition-all duration-300
                    hover:scale-105
                    md:hidden
                    ${
                      solid
                        ? "hover:bg-black hover:text-white"
                        : "hover:bg-white hover:text-black"
                    }
                  `}
                >
                  <Icon name={mobileOpen ? "close" : "menu"} size={19} />
                </button>

                {/* MOBILE SEARCH */}

                <button
                  type="button"
                  aria-label="جستجو"
                  onClick={() => openPanel("search")}
                  className={`
                    flex h-9 w-9
                    items-center justify-center
                    rounded-full
                    transition-all duration-300
                    hover:scale-105
                    lg:hidden
                    ${
                      solid
                        ? "hover:bg-black hover:text-white"
                        : "hover:bg-white hover:text-black"
                    }
                  `}
                >
                  <Icon name="search" size={18} />
                </button>

                {/* CART */}

                <button
                  type="button"
                  aria-label="سبد خرید"
                  onClick={() => openPanel("cart")}
                  className={`
                    relative
                    flex h-9 w-9
                    items-center justify-center
                    rounded-full
                    transition-all duration-300
                    hover:scale-105
                    ${
                      solid
                        ? `
                          bg-black
                          text-white
                          hover:bg-black/80
                        `
                        : `
                          bg-white
                          text-black
                          hover:bg-white/85
                        `
                    }
                  `}
                >
                  <Icon name="bag" size={18} />

                  <CountBadge solid={solid}>{cartCount}</CountBadge>
                </button>

                {/* WISHLIST */}

                <button
                  type="button"
                  aria-label="علاقه‌مندی‌ها"
                  onClick={() => openPanel("wishlist")}
                  className={`
                    relative
                    flex h-9 w-9
                    items-center justify-center
                    rounded-full
                    transition-all duration-300
                    hover:scale-105
                    ${
                      solid
                        ? "hover:bg-black hover:text-white"
                        : "hover:bg-white hover:text-black"
                    }
                  `}
                >
                  <Icon name="heart" size={18} />

                  <CountBadge solid={solid}>{favorites.length + savedDesigns.length}</CountBadge>
                </button>

                {/* ACCOUNT */}

                <button
                  type="button"
                  aria-label="حساب کاربری"
                  onClick={() => openPanel("account")}
                  className={`
                    flex h-9 w-9
                    items-center justify-center
                    rounded-full
                    transition-all duration-300
                    hover:scale-105
                    ${
                      solid
                        ? "hover:bg-black hover:text-white"
                        : "hover:bg-white hover:text-black"
                    }
                  `}
                >
                  <Icon name="user" size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* ========================
              DESKTOP NAV
          ======================== */}

          <nav
            className="
              hidden h-13.5
              items-center justify-center
              md:flex
              
            "
            style={{
              borderColor: solid
                ? "rgba(0,0,0,0.05)"
                : "rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex h-full items-center justify-center gap-1">
              {links.map((link) => {
                const active = isActive(link.href);

                return (
                  <div
                    key={link.href}
                    className="relative h-full"
                    onMouseEnter={() => link.href === "/shop" && setShopOpen(true)}
                    onMouseLeave={() => link.href === "/shop" && setShopOpen(false)}
                    onFocus={() => link.href === "/shop" && setShopOpen(true)}
                    onBlur={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) setShopOpen(false);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") setShopOpen(false);
                    }}
                  >
                  <Link
                    href={link.href}
                    aria-expanded={link.href === "/shop" ? shopOpen : undefined}
                    aria-controls={link.href === "/shop" ? "header-shop-categories" : undefined}
                    onClick={() => {
                      setShopOpen(false);
                      if (link.href === "/shop") setCategory("all");
                    }}
                    className={`
                      group
                      relative
                      flex h-full
                      items-center
                      px-5
                      text-[14px]
                      font-bold
                      transition-all duration-300
                      lg:px-10
                      ${
                        active
                          ? solid
                            ? "text-black"
                            : "text-white"
                          : solid
                            ? "text-black/50 hover:text-black"
                            : "text-white/60 hover:text-white"
                      }
                    `}
                  >
                    {link.name}

                    {/* ACTIVE / HOVER LINE */}

                    <span
                      className={`
                        absolute
                        bottom-0 left-1/2
                        h-0.5
                        -translate-x-1/2
                        transition-all duration-300
                        ${
                          active
                            ? solid
                              ? "w-7 bg-black"
                              : "w-7 bg-white"
                            : solid
                              ? "w-0 bg-black group-hover:w-5"
                              : "w-0 bg-white group-hover:w-5"
                        }
                      `}
                    />

                    {/* ACTIVE DOT */}

                    {active && (
                      <span
                        className={`
                          absolute
                          top-2
                          left-1/2
                          h-1 w-1
                          -translate-x-1/2
                          rounded-full
                          ${solid ? "bg-black" : "bg-white"}
                        `}
                      />
                    )}
                  </Link>
                  {link.href === "/shop" && (
                    <div
                      id="header-shop-categories"
                      className={`absolute right-0 top-full w-52 pt-2 transition-all duration-200 motion-reduce:transition-none ${
                        shopOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0 pointer-events-none"
                      }`}
                    >
                      <ul className="rounded-2xl border border-white/35 bg-white/90 p-2 text-right text-[#35232c] shadow-[0_16px_45px_rgba(0,0,0,0.15)] backdrop-blur-xl">
                        {shopCategories.map((category) => {
                          const matched = products.flatMap((product) => product.categories ?? []).find(
                            (item) => item.slug === category.slug || item.name.replace(/[\u200c\s]/g, "").replace(/ها$/, "") === category.name,
                          );
                          const slug = matched?.slug ?? category.slug;
                          return (
                            <li key={category.slug}>
                              <Link
                                href={`/shop?category=${encodeURIComponent(slug)}`}
                                onClick={() => {
                                  setCategory(slug);
                                  setShopOpen(false);
                                }}
                                className="block rounded-xl px-4 py-2.5 text-sm transition-colors hover:bg-[#f7c9dc]/45 focus-visible:bg-[#f7c9dc]/45 focus-visible:outline-2 focus-visible:outline-[#813e59]"
                              >
                                {category.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  </div>
                );
              })}
            </div>
          </nav>
        </div>
      </header>

      {/* ========================
          MOBILE MENU
      ======================== */}

      <div
        inert={!mobileOpen}
        aria-hidden={!mobileOpen}
        style={{ WebkitTapHighlightColor: "rgba(247, 201, 220, 0.3)" }}
        className={`
          fixed inset-0 z-90
          overflow-y-auto overscroll-contain bg-white
          text-[#35232c]
          transition-all duration-500
          motion-reduce:transition-none
          md:hidden
          ${
            mobileOpen
              ? `
                visible
                translate-y-0
                opacity-100
              `
              : `
                invisible
                -translate-y-4
                opacity-0
              `
          }
        `}
      >
        <div className="relative flex min-h-dvh flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[calc(var(--site-header-height,9rem)+1.25rem)]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-24 top-40 h-64 w-64 rounded-full bg-[#f7c9dc]/30 blur-3xl" />
            <div className="absolute -right-24 bottom-12 h-56 w-56 rounded-full bg-[#f7c9dc]/20 blur-3xl" />
          </div>
          {/* TOP LABEL */}

          <div className="relative mb-5 px-3">
            <p dir="ltr" className="text-center text-[9px] tracking-[0.3em] text-[#9a7b89]">
              THE LITTLE JOYS COLLECTION
            </p>
            <p dir="ltr" className="mt-3 text-center font-['Cormorant_Garamond'] text-5xl leading-none">
              Your <span className="italic text-[#be708f]">style.</span>
            </p>
            <p className="mt-3 text-center text-xs leading-6 text-[#8b7480]">
              هر انتخاب، یک داستان تازه.
            </p>
          </div>

          {/* LINKS */}

          <nav aria-label="منوی اصلی موبایل" className="relative flex flex-1 flex-col gap-1">
            {links.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => {
                    setMobileOpen(false);
                    if (link.href === "/shop") setCategory("all");
                  }}
                  className={`group flex min-h-12 items-center justify-between rounded-2xl border px-4 py-3 transition-colors focus-visible:outline-2 focus-visible:outline-[#be708f] ${
                    active
                      ? "border-[#efd5df] bg-[#fbedf3]"
                      : "border-transparent hover:border-[#f2e5eb] hover:bg-[#fdf6f9]"
                  }`}
                >
                  <span
                    className={`
                      text-base
                      transition-all duration-300
                      group-hover:-translate-x-1
                      ${
                        active
                          ? "font-semibold text-[#813e59]"
                          : "text-[#59444e] group-hover:text-[#813e59]"
                      }
                    `}
                  >
                    {link.name}
                  </span>

                  <div aria-hidden="true" className={`flex h-7 w-7 items-center justify-center rounded-full ${active ? "bg-white text-[#be708f]" : "bg-[#fbedf3] text-[#a36580]"}`}>
                    {active ? <span className="h-1.5 w-1.5 rounded-full bg-[#be708f]" /> : <Icon name="arrow" size={14} className="rotate-45" />}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* MOBILE FOOTER */}

          <div className="relative mt-5 border-t border-[#f0e4e9] pt-4">
            <p
              dir="ltr"
              className="
                text-center
                font-serif
                text-lg italic
                text-[#a88b98]
              "
            >
              Your style, your story.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
