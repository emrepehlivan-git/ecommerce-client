import { auth } from "@/lib/auth";
import OrdersClient from "@/components/orders/orders-client";

export default async function OrdersPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className="container mx-auto py-8 text-center">
        You must be logged in to view orders.
      </div>
    );
  }

  return <OrdersClient userId={userId} />;
}
