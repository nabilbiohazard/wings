import { notFound } from "next/navigation";
import { AccountShell } from "@/components/commerce/account-shell";
import { OrderDetail } from "@/components/commerce/orders";
export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!/^[1-9]\d*$/.test(id)) notFound();
  return (
    <AccountShell>
      <OrderDetail id={id} />
    </AccountShell>
  );
}
