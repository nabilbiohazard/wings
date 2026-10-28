import { AccountShell } from "@/components/commerce/account-shell";
import { AccountDashboard } from "@/components/commerce/account-dashboard";
import type { Metadata } from "next";
export const metadata: Metadata = {title:"حساب کاربری | دنیای شخصی وینگز"};
export default function AccountPage() {
  return (
    <AccountShell>
      <AccountDashboard />
    </AccountShell>
  );
}
