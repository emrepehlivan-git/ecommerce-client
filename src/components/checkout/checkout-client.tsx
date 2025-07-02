"use client";

import { useCart } from "@/contexts/cart-context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePostApiV1Order } from "@/api/generated/order/order";
import { OrderPlaceCommand, OrderItemRequest } from "@/api/generated/model";
import { Button } from "@/components/ui/button";
import { useGetApiV1UserAddressesUserUserId } from "@/api/generated/user-addresses/user-addresses";
import { UserAddressDto } from "@/api/generated/model";
import { useErrorHandler } from "@/lib/hooks/useErrorHandler";
import { Skeleton } from "../ui/skeleton";
import { Loader2 } from "lucide-react";

export default function CheckoutClient() {
  const { data: session } = useSession();
  const { cart, isLoading, totalAmount, totalItems, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { handleError } = useErrorHandler({ context: "CheckoutClient" });
  const userId = session?.user?.id || cart?.userId;
  if (!userId) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">You must be logged in to place an order.</h2>
      </div>
    );
  }
  const { data: addressesData, isLoading: addressesLoading } =
    useGetApiV1UserAddressesUserUserId(userId);
  const addresses: UserAddressDto[] = addressesData?.data || [];
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
        handleError(error, "An error occurred while creating the order.");
        setLoading(false);
      },
    },
  });

  const handleOrder = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      handleError("Your cart is empty.");
      return;
    }
    if (!selectedAddressId) {
      handleError("Please select a delivery address.");
      return;
    }
    const address = addresses.find((a) => a.id === selectedAddressId);
    if (!address) {
      handleError("Selected address not found.");
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

  if (isLoading || addressesLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Skeleton className="w-full h-12" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Your order has been created successfully!</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-lg py-8">
      <h2 className="text-3xl font-bold mb-6">Complete Order</h2>
      <div className="mb-4 p-4 border rounded bg-gray-50">
        <h3 className="font-semibold mb-2">Delivery Address</h3>
        {addresses.length === 0 ? (
          <div className="text-sm text-red-600">
            You have no address. Please add an address from your profile.
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
                    <span className="ml-2 text-xs text-green-600">(Default)</span>
                  )}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
      <div className="mb-4 p-4 border rounded bg-gray-50">
        <h3 className="font-semibold mb-2">Cart Summary</h3>
        <div className="text-sm mb-2">{totalItems} products</div>
        <div className="text-lg font-bold">Total: ₺{totalAmount?.toLocaleString("tr-TR")}</div>
      </div>
      <Button
        onClick={handleOrder}
        className="w-full h-12 text-lg"
        disabled={loading || addresses.length === 0}
      >
        {loading ? <Loader2 className="animate-spin" /> : "Complete Order"}
      </Button>
    </div>
  );
}
