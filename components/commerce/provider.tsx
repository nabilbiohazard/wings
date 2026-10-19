"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { commerce } from "@/lib/commerce-client";
import { cartKey, cartPayload, validCart } from "@/lib/commerce-types";
import type { CartItem, Customer } from "@/lib/commerce-types";

type CommerceContext = {
  customer: Customer | null;
  loading: boolean;
  error: string;
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  changeQuantity: (key: string, amount: number) => void;
  clearCart: () => void;
  loggedIn: (customer: Customer) => Promise<void>;
  updateCustomer: (customer: Customer) => void;
  logout: () => Promise<void>;
};
const Context = createContext<CommerceContext | null>(null);
const storageKey = "wings-cart-v1";

export function useCommerce() {
  const context = useContext(Context);
  if (!context) throw new Error("CommerceProvider is required");
  return context;
}

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [error, setError] = useState("");
  const queue = useRef(Promise.resolve());
  const identity = useRef<number | null>(null);
  const ready = useRef(false);

  useEffect(() => {
    let active = true;
    let stored: { owner?: number | null; items?: unknown } = {};
    try {
      stored = JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch {
      /* Invalid storage is ignored. */
    }
    const guest = stored.owner == null ? validCart(stored.items) : [];
    async function load() {
      try {
        const response = await fetch("/api/commerce/me", { cache: "no-store" });
        if (response.status === 401) {
          if (active) setCart(guest);
          return;
        }
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "اتصال حساب کاربری انجام نشد.");
        const remote = await commerce<{ items: CartItem[] }>("cart").catch(
          (failure) => {
            if (active) setError(failure.message);
            return {
              items:
                stored.owner === data.customer.id
                  ? validCart(stored.items)
                  : [],
            };
          },
        );
        if (active) {
          const merged = new Map(
            validCart(remote.items).map((item) => [cartKey(item), item]),
          );
          for (const item of guest)
            if (!merged.has(cartKey(item))) merged.set(cartKey(item), item);
          if (stored.owner === data.customer.id) {
            for (const item of validCart(stored.items).filter(
              (line) => line.design && line.design_pending,
            ))
              if (!merged.has(cartKey(item))) merged.set(cartKey(item), item);
          }
          identity.current = data.customer.id;
          setCustomer(data.customer);
          setCart([...merged.values()]);
        }
      } catch (failure) {
        if (active) {
          setError(
            failure instanceof Error
              ? failure.message
              : "ارتباط با فروشگاه انجام نشد.",
          );
          setCart(guest);
        }
      } finally {
        if (active) {
          ready.current = true;
          setLoading(false);
        }
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loading || !ready.current) return;
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ owner: customer?.id ?? null, items: cart }),
      );
    } catch {
      /* Cart remains usable when browser storage is disabled. */
    }
    if (!customer) return;
    const owner = customer.id;
    const timer = setTimeout(() => {
      queue.current = queue.current.then(async () => {
        if (identity.current !== owner) return;
        try {
          const result = await commerce<{ items: CartItem[] }>(
            "cart",
            {
              items: cart.map(cartPayload),
            },
            "PUT",
          );
          if (identity.current === owner) {
            setError("");
            if (cart.some((item) => item.design_pending)) {
              const confirmed = new Map(
                validCart(result.items).map((item) => [cartKey(item), item]),
              );
              setCart((current) => {
                let changed = false;
                const next = current.map((item) => {
                  const verified = confirmed.get(cartKey(item));
                  if (
                    item.design_pending &&
                    verified &&
                    item.quantity === verified.quantity
                  ) {
                    changed = true;
                    return { ...verified, design_pending: false };
                  }
                  return item;
                });
                return changed ? next : current;
              });
            }
          }
        } catch (failure) {
          if (identity.current === owner)
            setError(
              failure instanceof Error
                ? failure.message
                : "ذخیره سبد خرید انجام نشد.",
            );
        }
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [cart, customer, loading]);

  async function loggedIn(next: Customer) {
    const guest = identity.current === null ? cart : [];
    setLoading(true);
    try {
      await queue.current;
      const remote = await commerce<{ items: CartItem[] }>("cart");
      const merged = new Map(
        validCart(remote.items).map((item) => [cartKey(item), item]),
      );
      for (const item of guest)
        if (!merged.has(cartKey(item))) merged.set(cartKey(item), item);
      identity.current = next.id;
      setCustomer(next);
      setCart([...merged.values()]);
      setError("");
    } finally {
      setLoading(false);
    }
  }
  async function logout() {
    setLoading(true);
    try {
      await queue.current;
      if (customer) {
        // Flush a cart edit even if logout happened before the debounce timer fired.
        await commerce(
          "cart",
          {
            items: cart.map(cartPayload),
          },
          "PUT",
        ).catch(() => undefined);
      }
      await commerce("auth/logout", {});
      identity.current = null;
      setCustomer(null);
      setCart([]);
      setError("");
      try {
        localStorage.removeItem(storageKey);
      } catch {
        /* Session is still revoked when storage is unavailable. */
      }
    } finally {
      setLoading(false);
    }
  }
  function addItem(item: CartItem) {
    setCart((current) => {
      const key = cartKey(item);
      const existing = current.find((line) => cartKey(line) === key);
      if (existing)
        return current.map((line) =>
          cartKey(line) === key
            ? { ...line, quantity: Math.min(99, line.quantity + item.quantity) }
            : line,
        );
      return current.length < 50 ? [...current, item] : current;
    });
  }
  function changeQuantity(key: string, amount: number) {
    setCart((current) =>
      current
        .map((line) =>
          cartKey(line) === key
            ? { ...line, quantity: Math.min(99, line.quantity + amount) }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }
  return (
    <Context.Provider
      value={{
        customer,
        loading,
        cart,
        error,
        addItem,
        changeQuantity,
        clearCart: () => setCart([]),
        loggedIn,
        updateCustomer: setCustomer,
        logout,
      }}
    >
      {children}
    </Context.Provider>
  );
}
