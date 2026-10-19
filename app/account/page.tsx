import { AccountShell } from "@/components/commerce/account-shell";
import { OrderList } from "@/components/commerce/orders";
export default function AccountPage() {
  return (
    <AccountShell>
      <OrderList />
    </AccountShell>
  );
}
