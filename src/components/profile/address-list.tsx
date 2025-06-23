"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog";
import { 
  useGetApiUserAddressesUserUserId, 
  useDeleteApiUserAddressesId,
  usePatchApiUserAddressesIdSetDefault 
} from "@/api/generated/user-addresses/user-addresses";
import { UserAddressDto } from "@/api/generated/model";
import { MapPin, Trash2, Star, StarOff, Edit } from "lucide-react";
import { useErrorHandler } from "@/lib/hooks/useErrorHandler";
import { ErrorHelper } from "@/lib/errorHelper";
import { EditAddressModal } from "./edit-address-modal";
import { Hint } from "@/components/ui/hint";

interface AddressListProps {
  userId: string;
}

export function AddressList({ userId }: AddressListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [addressToEdit, setAddressToEdit] = useState<UserAddressDto | null>(null);

  const { data: addresses, isLoading, refetch } = useGetApiUserAddressesUserUserId(userId);
  const { handleError, handleSuccess } = useErrorHandler({ context: 'AddressList' });

  const deleteMutation = useDeleteApiUserAddressesId({
    mutation: {
      onSuccess: () => {
        handleSuccess("Adres başarıyla silindi!");
        refetch();
        setDeleteDialogOpen(false);
        setAddressToDelete(null);
      },
      onError: (error) => {
        const customMessage = ErrorHelper.getAddressOperationErrorMessage(error, 'delete');
        handleError(error, customMessage);
      },
    },
  });

  const setDefaultMutation = usePatchApiUserAddressesIdSetDefault({
    mutation: {
      onSuccess: () => {
        handleSuccess("Varsayılan adres güncellendi!");
        refetch();
      },
      onError: (error) => {
        const customMessage = ErrorHelper.getAddressOperationErrorMessage(error, 'setDefault');
        handleError(error, customMessage);
      },
    },
  });

  const handleDelete = (addressId: string) => {
    setAddressToDelete(addressId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!addressToDelete) {
      handleError('Silinecek adres ID\'si bulunamadı', 'Silme işlemi gerçekleştirilemedi');
      return;
    }

    if (!userId) {
      handleError('Kullanıcı ID\'si bulunamadı', 'Silme işlemi gerçekleştirilemedi');
      return;
    }

    deleteMutation.mutate({
      id: addressToDelete,
      data: { userId },
    });
  };

  const handleSetDefault = (addressId: string) => {
    if (!addressId) {
      handleError('Adres ID\'si bulunamadı', 'Varsayılan adres güncelleme işlemi gerçekleştirilemedi');
      return;
    }

    if (!userId) {
      handleError('Kullanıcı ID\'si bulunamadı', 'Varsayılan adres güncelleme işlemi gerçekleştirilemedi');
      return;
    }

    setDefaultMutation.mutate({
      id: addressId,
      data: { userId },
    });
  };

  const handleEdit = (address: UserAddressDto) => {
    setAddressToEdit(address);
    setEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <AddressSkeleton />
    );
  }

  if (!addresses?.data?.value || addresses.data.value.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Henüz adres eklenmemiş</CardTitle>
          <CardDescription>
            Teslimat için bir adres ekleyerek başlayın
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {addresses.data.value.map((address: UserAddressDto) => (
          <Card key={address.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <CardTitle className="text-lg">{address.label || "Adres"}</CardTitle>
                  {address.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      Varsayılan
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Hint 
                    label={address.isDefault ? "Varsayılan adres" : "Varsayılan yap"}
                    asChild
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(address.id!)}
                      disabled={setDefaultMutation.isPending || address.isDefault}
                    >
                      {address.isDefault ? (
                        <Star className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <StarOff className="w-4 h-4" />
                      )}
                    </Button>
                  </Hint>
                  <Hint label="Düzenle" asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(address)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Hint>
                  <Hint label="Sil" asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(address.id!)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </Hint>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.state} {address.zipCode}
                </p>
                <p>{address.country}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adresi Sil</DialogTitle>
            <DialogDescription>
              Bu adresi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Siliniyor..." : "Sil"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <EditAddressModal
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        address={addressToEdit}
        userId={userId}
        onSuccess={handleEditSuccess}
      />
    </>
  );
} 

const AddressSkeleton = () => {
  return (
    <div className="grid gap-4">
    {[...Array(2)].map((_, i) => (
      <Card key={i} className="animate-pulse">
        <CardHeader>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded"></div>
            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
  );
};