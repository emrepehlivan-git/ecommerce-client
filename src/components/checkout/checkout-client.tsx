"use client";

import { useCart } from "@/contexts/cart-context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePostApiOrder } from "@/api/generated/order/order";
import { OrderPlaceCommand, Address, OrderItemRequest } from "@/api/generated/model";
import { Button } from "@/components/ui/button";
import { useGetApiUserAddressesUserUserId } from "@/api/generated/user-addresses/user-addresses";
import { UserAddressDto } from "@/api/generated/model";

export default function CheckoutClient() {
  const { data: session } = useSession();
  const { cart, isLoading, totalAmount, totalItems, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const userId = session?.user?.id || cart?.userId;
  if (!userId) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Sipariş vermek için giriş yapmalısınız.</h2>
      </div>
    );
  }
  const { data: addressesData, isLoading: addressesLoading } = useGetApiUserAddressesUserUserId(userId);
  const addresses: UserAddressDto[] = addressesData?.data?.value || [];
  const defaultAddress = addresses.find(a => a.isDefault) || addresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(defaultAddress?.id);

  const postOrder = usePostApiOrder({
    mutation: {
      onSuccess: () => {
        setSuccess(true);
        setError(null);
        setLoading(false);
        clearCart();
        router.push("/profile/orders");
      },
      onError: (err: any) => {
        setError("Sipariş oluşturulurken hata oluştu.");
        setLoading(false);
      }
    }
  });

  const handleOrder = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      setError("Sepetiniz boş.");
      return;
    }
    if (!selectedAddressId) {
      setError("Lütfen teslimat adresi seçin.");
      return;
    }
    const address = addresses.find(a => a.id === selectedAddressId);
    if (!address) {
      setError("Seçili adres bulunamadı.");
      return;
    }
    setLoading(true);
    setError(null);
    const items: OrderItemRequest[] = cart.items.map(item => ({
      productId: item.productId!,
      quantity: item.quantity || 1
    }));
    const order: OrderPlaceCommand = {
      userId: cart.userId,
      shippingAddress: {
        street: address.street!,
        city: address.city!,
        zipCode: address.zipCode!,
        country: address.country!
      },
      billingAddress: {
        street: address.street!,
        city: address.city!,
        zipCode: address.zipCode!,
        country: address.country!
      },
      useSameForBilling: true,
      items
    };
    await postOrder.mutateAsync({ data: order });
  };

  if (isLoading || addressesLoading) {
    return <div className="container mx-auto py-8 text-center">Yükleniyor...</div>;
  }

  if (success) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Siparişiniz başarıyla oluşturuldu!</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-lg py-8">
      <h2 className="text-3xl font-bold mb-6">Siparişi Tamamla</h2>
      <div className="mb-4 p-4 border rounded bg-gray-50">
        <h3 className="font-semibold mb-2">Teslimat Adresi</h3>
        {addresses.length === 0 ? (
          <div className="text-sm text-red-600">Adresiniz yok. Profilinizden adres ekleyin.</div>
        ) : (
          <div className="space-y-2">
            {addresses.map(address => (
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
                  {address.isDefault && <span className="ml-2 text-xs text-green-600">(Varsayılan)</span>}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
      <div className="mb-4 p-4 border rounded bg-gray-50">
        <h3 className="font-semibold mb-2">Sepet Özeti</h3>
        <div className="text-sm mb-2">{totalItems} ürün</div>
        <div className="text-lg font-bold">Toplam: ₺{totalAmount?.toLocaleString('tr-TR')}</div>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <Button onClick={handleOrder} className="w-full h-12 text-lg" disabled={loading || addresses.length === 0}>
        {loading ? "Sipariş Veriliyor..." : "Siparişi Tamamla"}
      </Button>
    </div>
  );
} 