"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2, Package, Plus } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { CreateProductCommand, CategoryDto, UploadProductImagesResponse } from "@/api/generated/model";
import { usePostApiV1Product, useDeleteApiV1ProductId } from "@/api/generated/product/product";
import { useErrorHandler } from "@/lib/hooks/useErrorHandler";
import { ProductImageUpload, type ProductImageData } from "./product-image-upload";
import { useI18n } from "@/i18n/client";
import { axiosClientMutator } from "@/lib/axiosClient";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(200, "Product name must be at most 200 characters")
    .trim(),
  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters")
    .optional()
    .or(z.literal("")),
  price: z.number().min(0.01, "Price must be greater than 0").max(999999.99, "Price is too high"),
  categoryId: z.string().min(1, "Category selection is required"),
  stockQuantity: z
    .number()
    .min(0, "Stock quantity must be 0 or greater")
    .max(999999, "Stock quantity is too high"),
});

type FormData = z.infer<typeof formSchema>;

interface ProductCreateClientProps {
  categories: CategoryDto[];
}

export function ProductCreateClient({ categories }: ProductCreateClientProps) {
  const t = useI18n();
  const router = useRouter();
  const { handleError } = useErrorHandler();
  const [productImages, setProductImages] = useState<ProductImageData[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      categoryId: "",
      stockQuantity: 0,
    },
  });

  const deleteProductMutation = useDeleteApiV1ProductId({
    mutation: {
      onSuccess: () => {
        toast.info(t("products.create.rollback"));
      },
      onError: (error) => {
        handleError(error);
      },
    },
  });

  const uploadImagesMutation = useMutation({
    mutationFn: async ({
      productId,
      images,
    }: {
      productId: string;
      images: ProductImageData[];
    }) => {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append(`Images[${index}].File`, image.file);
        formData.append(`Images[${index}].ImageType`, image.imageType.toString());
        formData.append(`Images[${index}].DisplayOrder`, image.displayOrder.toString());
        if (image.altText) {
          formData.append(`Images[${index}].AltText`, image.altText);
        }
      });

      return axiosClientMutator({
        url: `/api/v1/Product/${productId}/images`,
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        data: formData,
      });
    },
    onSuccess: () => {
      toast.success(t("products.create.success"));
      router.push("/admin/products");
    },
    onError: (error, variables) => {
      handleError(error);
      deleteProductMutation.mutate({ id: variables.productId });
    },
  });

  const createMutation = usePostApiV1Product({
    mutation: {
      onSuccess: (response) => {
        const productId = response;

        if (productImages.length > 0) {
          uploadImagesMutation.mutate({
            productId,
            images: productImages,
          });
        } else {
          toast.success(t("products.create.success"));
          router.push("/admin/products");
        }
      },
      onError: (error) => {
        handleError(error);
      },
    },
  });

  const handleSubmit = (data: FormData) => {
    const createData: CreateProductCommand = {
      name: data.name,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId,
      stockQuantity: data.stockQuantity,
    };
    createMutation.mutate({ data: createData });
  };

  const handleCancel = () => {
    router.push("/admin/products");
  };

  const isPending =
    createMutation.isPending ||
    uploadImagesMutation.isPending ||
    deleteProductMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleCancel} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t("common.back")}
        </Button>
        <div>
          <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-6 w-6" />
            {t("products.create.title")}
          </h3>
          <p className="text-muted-foreground">{t("products.create.description")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {t("products.create.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("products.create.name")} *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("products.create.name")}
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("products.create.category")} *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("products.create.category")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id!}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("products.create.description")}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("products.create.description")}
                        className="resize-none min-h-[100px]"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("products.create.price")} (₺) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stockQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("products.create.stockQuantity")} *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <ProductImageUpload
                images={productImages}
                onImagesChange={setProductImages}
                disabled={isPending}
              />

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isPending}
                  className="flex-1 md:flex-none"
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 md:flex-none"
                >
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {uploadImagesMutation.isPending
                    ? t("products.create.uploadingImages")
                    : t("products.create.create")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
