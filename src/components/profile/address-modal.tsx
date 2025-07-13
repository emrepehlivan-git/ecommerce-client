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
import { useErrorHandler } from "@/hooks/use-error-handling";
import { useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/i18n/client";

const getAddressSchema = (t: any) =>
  z.object({
    label: z.string().min(1, t("profile.addresses.modal.validation.labelRequired")),
    street: z.string().min(1, t("profile.addresses.modal.validation.streetRequired")),
    city: z.string().min(1, t("profile.addresses.modal.validation.cityRequired")),
    zipCode: z.string().min(1, t("profile.addresses.modal.validation.zipCodeRequired")),
    country: z.string().min(1, t("profile.addresses.modal.validation.countryRequired")),
    isDefault: z.boolean().optional(),
  });

type AddressFormValues = z.infer<ReturnType<typeof getAddressSchema>>;

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
  const t = useI18n();
  const addressSchema = getAddressSchema(t);

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
        handleSuccess(t("profile.addresses.modal.addSuccess"));
        queryClient.invalidateQueries({
          queryKey: getGetApiV1UserAddressesUserUserIdQueryKey(userId),
        });
        onSuccess();
        onClose();
        form.reset();
      },
      onError: (error) => {
        handleError(error, t("profile.addresses.modal.addError"));
      },
    },
  });

  const editMutation = usePutApiV1UserAddressesId({
    mutation: {
      onSuccess: () => {
        handleSuccess(t("profile.addresses.modal.editSuccess"));
        queryClient.invalidateQueries({
          queryKey: getGetApiV1UserAddressesUserUserIdQueryKey(userId),
        });
        onSuccess();
        onClose();
        form.reset();
      },
      onError: (error) => {
        handleError(error, t("profile.addresses.modal.editError"));
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
  const title =
    mode === "add" ? t("profile.addresses.modal.addTitle") : t("profile.addresses.modal.editTitle");
  const description =
    mode === "add"
      ? t("profile.addresses.modal.addDescription")
      : t("profile.addresses.modal.editDescription");
  const submitText =
    mode === "add"
      ? t("profile.addresses.modal.saveButton")
      : t("profile.addresses.modal.updateButton");
  const loadingText =
    mode === "add"
      ? t("profile.addresses.modal.addingButton")
      : t("profile.addresses.modal.updatingButton");

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
                  <FormLabel>{t("profile.addresses.modal.labelLabel")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("profile.addresses.modal.labelPlaceholder")} {...field} />
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
                  <FormLabel>{t("profile.addresses.modal.streetLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("profile.addresses.modal.streetPlaceholder")}
                      {...field}
                    />
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
                    <FormLabel>{t("profile.addresses.modal.cityLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("profile.addresses.modal.cityPlaceholder")}
                        {...field}
                      />
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
                    <FormLabel>{t("profile.addresses.modal.zipCodeLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("profile.addresses.modal.zipCodePlaceholder")}
                        {...field}
                      />
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
                    <FormLabel>{t("profile.addresses.modal.countryLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("profile.addresses.modal.countryPlaceholder")}
                        {...field}
                      />
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
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>{t("profile.addresses.modal.defaultCheckbox")}</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                {t("profile.addresses.modal.cancelButton")}
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
