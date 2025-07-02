import { auth } from "@/lib/auth";
import OrdersClient from "@/components/orders/orders-client";
import { getI18n } from "@/i18n/server";

export default async function OrdersPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const t = await getI18n();

  if (!userId) {
    return (
      <div className="container mx-auto py-8 text-center">{t("profile.orders.loginRequired")}</div>
    );
  }

  return <OrdersClient userId={userId} />;
}
