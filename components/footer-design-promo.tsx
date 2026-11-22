"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export function FooterDesignPromo({ children }: { children: ReactNode }) {
  return usePathname() === "/shop" ? null : children;
}
