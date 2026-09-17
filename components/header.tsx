"use client";

import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

import { Icon } from "./icon";

import { useShop } from "./shop-provider";

import { Wordmark } from "./wordmark";

const links = [
  { name: "خانه", href: "/" },
  { name: "فروشگاه", href: "/shop" },
  { name: "خودت بساز", href: "/custom-design" },
  { name: "کالکشن‌ها", href: "/collections" },
  { name: "درباره ما", href: "/about" },
  { name: "مجله وینگز", href: "/blog" },
  { name: "تماس با ما", href: "/contact" },
];

function CountBadge({ children }: { children: number }) {
  if (!children) return null;

  return (
    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] text-white">
      {children}
    </span>
  );
}

export function Header() {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  const { openPanel, favorites, cart } = useShop();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
        scrolled ? "bg-white/90 text-black shadow-sm backdrop-blur-xl" : "bg-transparent text-white"
      } `}
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8">
        {/* TOP AREA */}

        <div className="flex flex-col gap-4 py-4 md:h-[78px] md:flex-row md:items-center md:justify-between md:py-0">
          {/* LOGO */}

          <div className="flex w-full justify-center md:w-auto">
            <Wordmark />
          </div>

          {/* DESKTOP SEARCH */}

          <button
            onClick={() => openPanel("search")}

            className={`group hidden h-11 w-[330px] items-center gap-4 rounded-full border px-6 transition-all duration-300 lg:flex ${
              scrolled ? "border-black/10 bg-black/[0.03]" : "border-white/30 bg-white/5"
            } hover:bg-white hover:text-black`}
          >
            <Icon name="search" size={19} />

            <span className="flex-1 text-right text-sm">جستجو در محصولات...</span>
          </button>

          {/* ACTIONS */}

          <div className="flex w-full items-center justify-center gap-6 md:w-auto">
            {/* MOBILE MENU */}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}

              className="transition hover:scale-110 md:hidden"
            >
              <Icon name={mobileOpen ? "close" : "menu"} />
            </button>
            {/* MOBILE SEARCH */}

            <button
              onClick={() => openPanel("search")}

              className="transition hover:scale-110 lg:hidden"
            >
              <Icon name="search" />
            </button>

            {/* CART */}

            <button
              onClick={() => openPanel("cart")}

              className="relative transition hover:scale-110"
            >
              <Icon name="bag" />

              <CountBadge>{cartCount}</CountBadge>
            </button>

            {/* WISHLIST */}

            <button
              onClick={() => openPanel("wishlist")}

              className="relative transition hover:scale-110"
            >
              <Icon name="heart" />

              <CountBadge>{favorites.length}</CountBadge>
            </button>

            {/* ACCOUNT */}

            <button
              onClick={() => openPanel("account")}

              className="transition hover:scale-110"
            >
              <Icon name="user" />
            </button>
          </div>
        </div>

        {/* DESKTOP NAV */}

        <nav className="hidden h-14 items-center justify-center gap-2 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <a
                key={link.href}

                href={link.href}

                className={`rounded-full px-7 py-2 text-sm font-medium transition-all duration-300 ${
                  active
                    ? scrolled
                      ? "bg-black text-white"
                      : "bg-white text-black"
                    : scrolled
                      ? "text-black hover:bg-black hover:text-white"
                      : "text-white hover:bg-white hover:text-black"
                } `}
              >
                {link.name}
              </a>
            );
          })}
        </nav>
      </div>

      {/* MOBILE MENU */}

      <div
        className={`fixed top-[150px] right-0 left-0 min-h-[calc(100vh-150px)] bg-white text-black transition-all duration-500 md:hidden ${
          mobileOpen
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-full opacity-0"
        } `}
      >
        <nav className="flex flex-col items-center gap-4 pt-8">
          {links.map((link) => (
            <a
              key={link.href}

              href={link.href}

              onClick={() => setMobileOpen(false)}

              className={`w-[85%] rounded-full px-6 py-4 text-center text-lg transition-all ${
                pathname === link.href ? "bg-black text-white" : "bg-black/[0.04]"
              } `}
            >
              {link.name}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
