"use client";

import { useAppStore } from "@/stores/useAppStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePostApiV1Order } from "@/api/generated/order/order";
import { OrderPlaceCommand, OrderItemRequest } from "@/api/generated/model";
import { Button } from "@/components/ui/button";
import { useGetApiV1UserAddressesUserUserId } from "@/api/generated/user-addresses/user-addresses";
import { UserAddressDto } from "@/api/generated/model";
import { useErrorHandler } from "@/hooks/use-error-handling";
import { Skeleton } from "../ui/skeleton";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/i18n/client";

export default function CheckoutClient() {
  const t = useI18n();
  const { data: session } = useSession();
  const { cart, isLoadingCart, totalAmount, totalItems, clearCart } = useAppStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { handleError } = useErrorHandler({ context: "CheckoutClient" });
  const userId = session?.user?.id || cart?.userId;
  if (!userId) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">{t("checkout.loginRequired")}</h2>
      </div>
    );
  }
  const { data: addressesData, isLoading: addressesLoading } =
    useGetApiV1UserAddressesUserUserId(userId);
  const addresses: UserAddressDto[] = addressesData || [];
  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(
    defaultAddress?.id
  );

  const postOrder = usePostApiV1Order({
    mutation: {
      onSuccess: () => {
        setSuccess(true);
        setLoading(false);
        clearCart();
        router.push("/profile/orders");
      },
      onError: (error) => {
        handleError(error);
        setLoading(false);
      },
    },
  });

  const handleOrder = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      handleError();
      return;
    }
    if (!selectedAddressId) {
      handleError();
      return;
    }
    const address = addresses.find((a) => a.id === selectedAddressId);
    if (!address) {
      handleError();
      return;
    }
    setLoading(true);
    const items: OrderItemRequest[] = cart.items.map((item) => ({
      productId: item.productId!,
      quantity: item.quantity || 1,
    }));
    const order: OrderPlaceCommand = {
      userId: cart.userId,
      shippingAddress: {
        street: address.street!,
        city: address.city!,
        zipCode: address.zipCode!,
        country: address.country!,
      },
      billingAddress: {
        street: address.street!,
        city: address.city!,
        zipCode: address.zipCode!,
        country: address.country!,
      },
      useSameForBilling: true,
      items,
    };
    await postOrder.mutateAsync({ data: order });
  };

  if (isLoadingCart || addressesLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Skeleton className="w-full h-12" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">{t("checkout.success")}</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-lg py-8">
      <h2 className="text-3xl font-bold mb-6">{t("checkout.title")}</h2>
      <div className="mb-4 p-4 border rounded bg-gray-50">
        <h3 className="font-semibold mb-2">{t("checkout.deliveryAddress")}</h3>
        {addresses.length === 0 ? (
          <div className="text-sm text-red-600">
            {t("checkout.noAddress")}
          </div>
        ) : (
          <div className="space-y-2">
            {addresses.map((address) => (
              <label key={address.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="address"
                  value={address.id}
                  checked={selectedAddressId === address.id}
                  onChange={() => setSelectedAddressId(address.id)}
                  className="accent-primary"
                />
                <span>
                  {address.label ? address.label + " - " : ""}
                  {address.street}, {address.city} {address.zipCode}, {address.country}
                  {address.isDefault && (
                    <span className="ml-2 text-xs text-green-600">({t("profile.addresses.list.defaultBadge")})</span>
                  )}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
      <div className="mb-4 p-4 border rounded bg-gray-50">
        <h3 className="font-semibold mb-2">{t("checkout.cartSummary")}</h3>
        <div className="text-sm mb-2">{t("checkout.productsCount", { count: totalItems })}</div>
        <div className="text-lg font-bold">{t("checkout.total")} ₺{totalAmount?.toLocaleString("tr-TR")}</div>
      </div>
      <Button
        onClick={handleOrder}
        className="w-full h-12 text-lg"
        disabled={loading || addresses.length === 0}
      >
        {loading ? <Loader2 className="animate-spin" /> : t("checkout.completeOrder")}
      </Button>
    </div>
  );
}
