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
  usePostApiUserAddresses, 
  usePutApiUserAddressesId,
  getGetApiUserAddressesUserUserIdQueryKey
} from "@/api/generated/user-addresses/user-addresses";
import { UserAddressDto, AddUserAddressCommand, UpdateUserAddressRequest } from "@/api/generated/model";
import { useErrorHandler } from "@/lib/hooks/useErrorHandler";
import { useQueryClient } from "@tanstack/react-query";

const addressSchema = z.object({
  label: z.string().min(1, "Adres etiketi gereklidir"),
  street: z.string().min(1, "Sokak adresi gereklidir"),
  city: z.string().min(1, "Şehir gereklidir"),
  zipCode: z.string().min(1, "Posta kodu gereklidir"),
  country: z.string().min(1, "Ülke gereklidir"),
  isDefault: z.boolean().optional(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess: () => void;
  address?: UserAddressDto | null;
  mode: 'add' | 'edit';
}

export function AddressModal({ 
  isOpen, 
  onClose, 
  userId, 
  onSuccess,
  address = null,
  mode = 'add'
}: AddressModalProps) {
  const { handleError, handleSuccess } = useErrorHandler({ context: 'AddressModal' });
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

  const addMutation = usePostApiUserAddresses({
    mutation: {
      onSuccess: () => {
        handleSuccess("Adres başarıyla eklendi!");
        // Cache'i invalidate et
        queryClient.invalidateQueries({
          queryKey: getGetApiUserAddressesUserUserIdQueryKey(userId)
        });
        onSuccess();
        onClose();
        form.reset();
      },
      onError: (error) => {
        handleError(error, 'Adres eklenirken bir hata oluştu');
      },
    },
  });

  const editMutation = usePutApiUserAddressesId({
    mutation: {
      onSuccess: () => {
        handleSuccess("Adres başarıyla güncellendi!");
        // Cache'i invalidate et
        queryClient.invalidateQueries({
          queryKey: getGetApiUserAddressesUserUserIdQueryKey(userId)
        });
        onSuccess();
        onClose();
        form.reset();
      },
      onError: (error) => {
        handleError(error, 'Adres güncellenirken bir hata oluştu');
      },
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && address) {
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
    if (mode === 'add') {
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
  const title = mode === 'add' ? 'Yeni Adres Ekle' : 'Adresi Düzenle';
  const description = mode === 'add' ? 'Teslimat için yeni bir adres ekleyin' : 'Adres bilgilerinizi güncelleyin';
  const submitText = mode === 'add' ? 'Kaydet' : 'Güncelle';
  const loadingText = mode === 'add' ? 'Ekleniyor...' : 'Güncelleniyor...';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adres Etiketi</FormLabel>
                  <FormControl>
                    <Input placeholder="Ev, İş, vb." {...field} />
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
                  <FormLabel>Sokak Adresi</FormLabel>
                  <FormControl>
                    <Input placeholder="Sokak, mahalle, apartman no" {...field} />
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
                    <FormLabel>Şehir</FormLabel>
                    <FormControl>
                      <Input placeholder="İstanbul" {...field} />
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
                    <FormLabel>Posta Kodu</FormLabel>
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
                    <FormLabel>Ülke</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {mode === 'add' && (
              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Bu adresi varsayılan adres olarak ayarla
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            )}

            <div className="flex gap-2 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? loadingText : submitText}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 