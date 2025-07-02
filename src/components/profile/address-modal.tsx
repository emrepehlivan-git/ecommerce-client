"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  usePostApiV1UserAddresses,
  usePutApiV1UserAddressesId,
  getGetApiV1UserAddressesUserUserIdQueryKey,
} from "@/api/generated/user-addresses/user-addresses";
import {
  UserAddressDto,
  AddUserAddressCommand,
  UpdateUserAddressRequest,
} from "@/api/generated/model";
import { useErrorHandler } from "@/lib/hooks/useErrorHandler";
import { useQueryClient } from "@tanstack/react-query";

const addressSchema = z.object({
  label: z.string().min(1, "Address label is required"),
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
  isDefault: z.boolean().optional(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess: () => void;
  address?: UserAddressDto | null;
  mode: "add" | "edit";
}

export function AddressModal({
  isOpen,
  onClose,
  userId,
  onSuccess,
  address = null,
  mode = "add",
}: AddressModalProps) {
  const { handleError, handleSuccess } = useErrorHandler({ context: "AddressModal" });
  const queryClient = useQueryClient();

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: "",
      street: "",
      city: "",
      zipCode: "",
      country: "Türkiye",
      isDefault: false,
    },
  });

  const addMutation = usePostApiV1UserAddresses({
    mutation: {
      onSuccess: () => {
        handleSuccess("Address added successfully!");
        queryClient.invalidateQueries({
          queryKey: getGetApiV1UserAddressesUserUserIdQueryKey(userId),
        });
        onSuccess();
        onClose();
        form.reset();
      },
      onError: (error) => {
        handleError(error, "Error adding address");
      },
    },
  });

  const editMutation = usePutApiV1UserAddressesId({
    mutation: {
      onSuccess: () => {
        handleSuccess("Address updated successfully!");
        queryClient.invalidateQueries({
          queryKey: getGetApiV1UserAddressesUserUserIdQueryKey(userId),
        });
        onSuccess();
        onClose();
        form.reset();
      },
      onError: (error) => {
        handleError(error, "Error updating address");
      },
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && address) {
        form.reset({
          label: address.label || "",
          street: address.street || "",
          city: address.city || "",
          zipCode: address.zipCode || "",
          country: address.country || "Türkiye",
          isDefault: address.isDefault || false,
        });
      } else {
        form.reset({
          label: "",
          street: "",
          city: "",
          zipCode: "",
          country: "Türkiye",
          isDefault: false,
        });
      }
    }
  }, [isOpen, mode, address, form]);

  const onSubmit = (values: AddressFormValues) => {
    if (mode === "add") {
      const data: AddUserAddressCommand = {
        userId,
        label: values.label,
        street: values.street,
        city: values.city,
        zipCode: values.zipCode,
        country: values.country,
        isDefault: values.isDefault || false,
      };
      addMutation.mutate({ data });
    } else {
      if (!address?.id) return;

      const data: UpdateUserAddressRequest = {
        userId,
        label: values.label,
        street: values.street,
        city: values.city,
        zipCode: values.zipCode,
        country: values.country,
      };

      editMutation.mutate({
        id: address.id,
        data,
      });
    }
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  const isLoading = addMutation.isPending || editMutation.isPending;
  const title = mode === "add" ? "Add New Address" : "Edit Address";
  const description =
    mode === "add" ? "Add a new address for delivery" : "Update your address information";
  const submitText = mode === "add" ? "Save" : "Update";
  const loadingText = mode === "add" ? "Adding..." : "Updating...";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Label</FormLabel>
                  <FormControl>
                    <Input placeholder="Home, Work, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Street, neighborhood, apartment no" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Istanbul" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="34000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {mode === "add" && (
              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Set as default address</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            )}

            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? loadingText : submitText}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
