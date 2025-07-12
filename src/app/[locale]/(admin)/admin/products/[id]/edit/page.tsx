import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getApiV1Category } from "@/api/generated/category/category";
import { getApiV1ProductId } from "@/api/generated/product/product";
import { ProductEditClient } from "@/components/admin/products/product-edit-client";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Edit Product",
  description: "Product edit page",
};

interface ProductEditPageProps {
  params: {
    id: string;
  };
}

function ProductEditSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-20 w-full" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  );
}

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  const { id } = await params;

  const [categoriesResponse, productResponse] = await Promise.all([
    getApiV1Category(),
    getApiV1ProductId(id),
  ]);

  if (!productResponse) {
    notFound();
  }

  return (
    <Suspense fallback={<ProductEditSkeleton />}>
      <ProductEditClient
        categories={categoriesResponse.value ?? []}
        product={productResponse}
      />
    </Suspense>
  );
}
