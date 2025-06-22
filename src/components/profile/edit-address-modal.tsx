"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { usePutApiUserAddressesId } from "@/api/generated/user-addresses/user-addresses";
import { UserAddressDto, UpdateUserAddressRequest } from "@/api/generated/model";
import { useErrorHandler } from "@/lib/hooks/useErrorHandler";

const editAddressSchema = z.object({
  label: z.string().min(1, "Adres etiketi gereklidir"),
  street: z.string().min(1, "Sokak adresi gereklidir"),
  city: z.string().min(1, "Şehir gereklidir"),
  state: z.string().min(1, "İl/Eyalet gereklidir"),
  zipCode: z.string().min(1, "Posta kodu gereklidir"),
  country: z.string().min(1, "Ülke gereklidir"),
});

type EditAddressFormValues = z.infer<typeof editAddressSchema>;

interface EditAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: UserAddressDto | null;
  userId: string;
  onSuccess: () => void;
}

export function EditAddressModal({ 
  isOpen, 
  onClose, 
  address, 
  userId, 
  onSuccess 
}: EditAddressModalProps) {
  const { handleError, handleSuccess } = useErrorHandler({ context: 'EditAddressModal' });

  const form = useForm<EditAddressFormValues>({
    resolver: zodResolver(editAddressSchema),
    defaultValues: {
      label: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Türkiye",
    },
  });

  const editMutation = usePutApiUserAddressesId({
    mutation: {
      onSuccess: () => {
        handleSuccess("Adres başarıyla güncellendi!");
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
    if (address && isOpen) {
      form.reset({
        label: address.label || "",
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        zipCode: address.zipCode || "",
        country: address.country || "Türkiye",
      });
    }
  }, [address, isOpen, form]);

  const onSubmit = (values: EditAddressFormValues) => {
    if (!address?.id) return;
    
    const data: UpdateUserAddressRequest = {
      userId,
      label: values.label,
      street: values.street,
      city: values.city,
      state: values.state,
      zipCode: values.zipCode,
      country: values.country,
    };
    
    editMutation.mutate({
      id: address.id,
      data,
    });
  };

  const handleClose = () => {
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adresi Düzenle</DialogTitle>
          <DialogDescription>
            Adres bilgilerinizi güncelleyin
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

            <div className="grid grid-cols-2 gap-4">
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

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İl/Eyalet</FormLabel>
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
                disabled={editMutation.isPending}
              >
                {editMutation.isPending ? "Güncelleniyor..." : "Güncelle"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 