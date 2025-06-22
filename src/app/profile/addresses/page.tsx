import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { AddressList } from "@/components/profile/address-list";

export default async function AddressesPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Adreslerim</h2>
          <p className="text-muted-foreground">
            Teslimat adreslerinizi yönetin
          </p>
        </div>
        <Link href="/profile/addresses/add">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Adres Ekle
          </Button>
        </Link>
      </div>

      <AddressList userId={session?.user.id || ""} />
    </div>
  );
}
