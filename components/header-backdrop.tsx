"use client";

import { usePathname } from "next/navigation";
import { getHeaderColor } from "@/lib/header-theme";

export function HeaderBackdrop() {
  const pathname = usePathname();
  return (
    <div
      aria-hidden="true"
      className="header-backdrop"
      style={{ backgroundColor: `var(--route-header-background, ${getHeaderColor(pathname)})` }}
    />
  );
}
