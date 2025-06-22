import { AddressForm } from "@/components/profile/address-form";
import { auth } from "@/lib/auth";

export default async function AddAddressPage() {
  const session = await auth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h4 className="text-2xl font-bold">Yeni Adres Ekle</h4>
        <p className="text-muted-foreground">
          Hesabınıza yeni bir teslimat adresi ekleyin
        </p>
      </div>
      
      <AddressForm userId={session?.user.id || ""} />
    </div>
  );
} 