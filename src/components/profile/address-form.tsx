"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { usePostApiUserAddresses } from "@/api/generated/user-addresses/user-addresses";
import { AddUserAddressCommand } from "@/api/generated/model";
import { toast } from "sonner";

const addressFormSchema = z.object({
  userId: z.string(),
  label: z.string().min(1, "Adres etiketi gereklidir"),
  street: z.string().min(1, "Sokak adresi gereklidir"),
  city: z.string().min(1, "Şehir gereklidir"),
  state: z.string().min(1, "İl/Eyalet gereklidir"),
  zipCode: z.string().min(1, "Posta kodu gereklidir"),
  country: z.string().min(1, "Ülke gereklidir"),
  isDefault: z.boolean(),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

interface AddressFormProps {
  userId: string;
}

export function AddressForm({ userId }: AddressFormProps) {
  const router = useRouter();
  
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      userId,
      label: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Türkiye",
      isDefault: false,
    },
  });

  const mutation = usePostApiUserAddresses({
    mutation: {
      onSuccess: () => {
        toast.success("Adres başarıyla eklendi!");
        router.push("/profile/addresses");
        router.refresh();
      },
      onError: (error) => {
        console.log(error);
        toast.error((error as Error).message);
      },
    },
  });

  const onSubmit = (values: AddressFormValues) => {
    const data: AddUserAddressCommand = {
      userId: values.userId,
      label: values.label,
      street: values.street,
      city: values.city,
      state: values.state,
      zipCode: values.zipCode,
      country: values.country,
      isDefault: values.isDefault,
    };
    mutation.mutate({ data });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Yeni Adres Ekle</CardTitle>
        <CardDescription>
          Teslimat için yeni bir adres ekleyin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
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
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/profile/addresses")}
                className="flex-1"
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1"
              >
                {mutation.isPending ? "Ekleniyor..." : "Adres Ekle"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 