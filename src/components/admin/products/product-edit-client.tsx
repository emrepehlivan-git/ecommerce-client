"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2, Package, Edit } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

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

import type { UpdateProductCommand, CategoryDto, ProductDto } from "@/api/generated/model";
import { usePutApiV1ProductId } from "@/api/generated/product/product";
import { useErrorHandler } from "@/lib/hooks/useErrorHandler";

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
});

type FormData = z.infer<typeof formSchema>;

interface ProductEditClientProps {
  categories: CategoryDto[];
  product: ProductDto;
}

export function ProductEditClient({ categories, product }: ProductEditClientProps) {
  const router = useRouter();
  const { handleError } = useErrorHandler();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      categoryId: "",
    },
  });

  useEffect(() => {
    if (product && categories.length > 0) {
      const categoryId =
        categories.find(
          (cat) => cat.name?.toLowerCase().trim() === product.categoryName?.toLowerCase().trim()
        )?.id || "";

      const formData = {
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        categoryId,
      };

      form.reset(formData);

      if (categoryId) {
        setTimeout(() => {
          form.setValue("categoryId", categoryId);
        }, 100);
      }
    }
  }, [product, categories, form]);

  const updateMutation = usePutApiV1ProductId({
    mutation: {
      onSuccess: () => {
        toast.success("Product updated successfully");
        router.push("/admin/products");
      },
      onError: (error) => {
        handleError(error);
      },
    },
  });

  const handleSubmit = (data: FormData) => {
    if (!product?.id) return;

    const updateData: UpdateProductCommand = {
      id: product.id,
      name: data.name,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId,
    };
    updateMutation.mutate({ id: product.id, data: updateData });
  };

  const handleCancel = () => {
    router.push("/admin/products");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleCancel} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-6 w-6" />
            Edit Product
          </h3>
          <p className="text-muted-foreground">{product.name} - Update product information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Product Information
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
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter product name"
                          {...field}
                          disabled={updateMutation.isPending}
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
                      <FormLabel>Category *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={updateMutation.isPending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Product description (optional)"
                        className="resize-none min-h-[100px]"
                        {...field}
                        disabled={updateMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₺) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        disabled={updateMutation.isPending}
                        className="md:max-w-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={updateMutation.isPending}
                  className="flex-1 md:flex-none"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex-1 md:flex-none"
                >
                  {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
