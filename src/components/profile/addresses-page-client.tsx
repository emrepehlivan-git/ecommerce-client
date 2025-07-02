"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddressList } from "./address-list";
import { AddressModal } from "./address-modal";

interface AddressesPageClientProps {
  userId: string;
}

export function AddressesPageClient({ userId }: AddressesPageClientProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Addresses</h2>
          <p className="text-muted-foreground">Manage your delivery addresses</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Address
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
