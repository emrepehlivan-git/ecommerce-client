import { OrderDto } from "@/api/generated/model/orderDto";

export default async function AddressesPage() {
  const addresses: OrderDto[] = [];
  addresses.push({
    id: "1",
    shippingAddress: "123 Main St, Anytown, USA",
    billingAddress: "123 Main St, Anytown, USA",
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Adreslerim</h2>
      <p>Burada adresleriniz listelenecek.</p>
      {/* Adres listesi burada gösterilecek */}
    </div>
  );
}
