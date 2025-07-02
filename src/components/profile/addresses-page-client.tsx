"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddressList } from "./address-list";
import { AddressModal } from "./address-modal";
import { useI18n } from "@/i18n/client";

interface AddressesPageClientProps {
  userId: string;
}

export function AddressesPageClient({ userId }: AddressesPageClientProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const t = useI18n();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t("profile.addresses.client.title")}</h2>
          <p className="text-muted-foreground">{t("profile.addresses.client.description")}</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t("profile.addresses.client.addNewAddress")}
        </Button>
      </div>

      <AddressList userId={userId} />

      <AddressModal
        isOpen={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        userId={userId}
        onSuccess={() => {
          setAddDialogOpen(false);
        }}
        mode="add"
      />
    </div>
  );
}
