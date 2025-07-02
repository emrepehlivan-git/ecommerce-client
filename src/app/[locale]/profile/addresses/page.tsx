import { auth } from "@/lib/auth";
import { AddressesPageClient } from "@/components/profile/addresses-page-client";

export default async function AddressesPage() {
  const session = await auth();

  return (
    <AddressesPageClient userId={session?.user.id || ""} />
  );
}
