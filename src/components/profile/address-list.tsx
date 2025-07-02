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
  useGetApiV1UserAddressesUserUserId,
  useDeleteApiV1UserAddressesId,
  usePatchApiV1UserAddressesIdSetDefault,
  getGetApiV1UserAddressesUserUserIdQueryKey,
} from "@/api/generated/user-addresses/user-addresses";
import { UserAddressDto } from "@/api/generated/model";
import { MapPin, Trash2, Star, StarOff, Edit } from "lucide-react";
import { useErrorHandler } from "@/lib/hooks/useErrorHandler";
import { useQueryClient } from "@tanstack/react-query";
import { ErrorHelper } from "@/lib/errorHelper";
import { AddressModal } from "./address-modal";
import { Hint } from "@/components/ui/hint";

interface AddressListProps {
  userId: string;
}

export function AddressList({ userId }: AddressListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [addressToEdit, setAddressToEdit] = useState<UserAddressDto | null>(null);

  const { data: addresses, isLoading, refetch } = useGetApiV1UserAddressesUserUserId(userId);
  const { handleError, handleSuccess } = useErrorHandler({ context: "AddressList" });
  const queryClient = useQueryClient();

  const deleteMutation = useDeleteApiV1UserAddressesId({
    mutation: {
      onSuccess: () => {
        handleSuccess("Address deleted successfully!");
        queryClient.invalidateQueries({
          queryKey: getGetApiV1UserAddressesUserUserIdQueryKey(userId),
        });
        setDeleteDialogOpen(false);
        setAddressToDelete(null);
        refetch();
      },
      onError: (error) => {
        const customMessage = ErrorHelper.getAddressOperationErrorMessage(error, "delete");
        handleError(error, customMessage);
      },
    },
  });

  const setDefaultMutation = usePatchApiV1UserAddressesIdSetDefault({
    mutation: {
      onSuccess: () => {
        handleSuccess("Default address updated!");
        queryClient.invalidateQueries({
          queryKey: getGetApiV1UserAddressesUserUserIdQueryKey(userId),
        });
        refetch();
      },
      onError: (error) => {
        const customMessage = ErrorHelper.getAddressOperationErrorMessage(error, "setDefault");
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
      handleError("Address not found");
      return;
    }

    if (!userId) {
      handleError("User not found");
      return;
    }

    deleteMutation.mutate({
      id: addressToDelete,
      data: { userId },
    });
  };

  const handleSetDefault = (addressId: string) => {
    if (!addressId) {
      handleError("Cannot set default address");
      return;
    }

    if (!userId) {
      handleError("User not found");
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
    refetch();
  };

  if (isLoading) {
    return <AddressSkeleton />;
  }

  if (!addresses?.data || addresses.data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">No address added yet</CardTitle>
          <CardDescription>Add an address to start delivering</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {addresses.data.map((address: UserAddressDto) => (
          <Card key={address.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <CardTitle className="text-lg">{address.label || "Address"}</CardTitle>
                  {address.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      Default
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Hint label={address.isDefault ? "Default address" : "Set as default"} asChild>
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
                  <Hint label="Edit" asChild>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(address)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Hint>
                  <Hint label="Delete" asChild>
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
                  {address.city} {address.zipCode}
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
            <DialogTitle>Delete Address</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this address? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AddressModal
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        address={addressToEdit}
        userId={userId}
        mode="edit"
        onSuccess={() => {
          setEditDialogOpen(false);
          refetch();
          setAddressToEdit(null);
        }}
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
