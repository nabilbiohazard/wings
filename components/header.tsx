"use client";

// @refresh reset

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
      const height = header.getBoundingClientRect().height;
      if (height === 0) return;
      document.documentElement.style.setProperty(
        "--site-header-height",
        `${height}px`,
      );
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { openPanel, favorites, cart } = useShop();
  const savedDesigns = useSavedDesigns();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isHome = pathname === "/";
  const solid = isHome && (scrolled || mobileOpen);

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
        data-site-header
        ref={headerRef}
        className={`
          fixed left-0 top-0 z-100
          w-full
          transition-all duration-500
          ${solid ? "text-black" : "text-white"}
        `}
      >
        {/* BACKGROUND */}

        <div
          style={{ backgroundColor: isHome ? undefined : getHeaderColor(pathname) }}
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
                  ${isHome ? "bg-transparent" : ""}
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
                  flex w-full max-w-78 items-center justify-between
                  gap-2 md:w-auto md:max-w-none md:justify-start md:gap-1
                  rounded-full
                  border
                  px-3 py-1.5 md:p-1.5
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

                <Link
                  href="/account/profile"
                  aria-label="حساب کاربری"
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
                </Link>
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
                  <Link
                    key={link.href}
                    href={link.href}
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
        className={`
          fixed inset-0 z-90
          bg-white
          text-black
          transition-all duration-500
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
        <div className="flex min-h-screen flex-col px-6 pb-8 pt-36.25">
          {/* TOP LABEL */}

          <div className="flex items-center justify-between border-b border-black/8 pb-4">
            <span className="text-[10px] tracking-[4px] text-black/30">
              WINGS GALLERY
            </span>

            <span className="text-[10px] tracking-[2px] text-black/30">
              MENU
            </span>
          </div>

          {/* LINKS */}

          <nav className="flex flex-1 flex-col justify-center">
            {links.map((link, index) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="
                    group
                    flex items-center
                    justify-between
                    border-b border-black/[0.07]
                    py-4
                  "
                >
                  <span
                    className={`
                      text-2xl
                      transition-all duration-300
                      group-hover:-translate-x-1
                      ${
                        active
                          ? "font-medium text-black"
                          : "text-black/55 group-hover:text-black"
                      }
                    `}
                  >
                    {link.name}
                  </span>

                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-black/20">
                      0{index + 1}
                    </span>

                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-black" />
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* MOBILE FOOTER */}

          <div className="border-t border-black/8 pt-5">
            <p
              dir="ltr"
              className="
                text-center
                font-serif
                text-lg italic
                text-black/50
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
