"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Package } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

import {
  useGetApiV1Product,
  useDeleteApiV1ProductId,
  getGetApiV1ProductQueryKey,
} from "@/api/generated/product/product";
import type { ProductDto } from "@/api/generated/model";

import { useErrorHandler } from "@/lib/hooks/useErrorHandler";
import { useDebounce } from "@/hooks/use-debounce";
import { getProductColumns } from "./products-table-columns";

export function ProductsPageClient() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  const [deletingProduct, setDeletingProduct] = useState<ProductDto | null>(null);
  const { handleError } = useErrorHandler();
  const debouncedGlobalFilter = useDebounce(globalFilter);

  const queryClient = useQueryClient();

  const {
    data: productsResponse,
    isLoading,
    isFetching,
  } = useGetApiV1Product({
    Page: currentPage,
    PageSize: pageSize,
    Search: debouncedGlobalFilter || undefined,
  });

  const queryKey = getGetApiV1ProductQueryKey({
    Page: currentPage,
    PageSize: pageSize,
    Search: debouncedGlobalFilter || undefined,
  });

  const deleteMutation = useDeleteApiV1ProductId({
    mutation: {
      onSuccess: () => {
        toast.success("Product deleted successfully");
        setDeletingProduct(null);
        queryClient.invalidateQueries({ queryKey });
      },
      onError: (error) => {
        handleError(error);
      },
    },
  });

  const handleDelete = () => {
    if (!deletingProduct?.id) return;
    deleteMutation.mutate({ id: deletingProduct.id });
  };

  const handleEdit = (product: ProductDto) => {
    router.push(`/admin/products/${product.id}/edit`);
  };

  const handleDeleteClick = (product: ProductDto) => {
    setDeletingProduct(product);
  };

  const handleAddNew = () => {
    router.push("/admin/products/create");
  };

  const handleCloseDeleteDialog = () => {
    setDeletingProduct(null);
  };

  const columns = getProductColumns({
    handleEdit,
    handleDeleteClick,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-6 w-6" />
            Products
          </h2>
          <p className="text-muted-foreground">Product management and stock control</p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          New Product
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={productsResponse?.data?.value ?? []}
        page={currentPage}
        pageSize={pageSize}
        totalPages={productsResponse?.data?.pagedInfo?.totalPages ?? 1}
        totalRecords={productsResponse?.data?.pagedInfo?.totalRecords ?? 0}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        isLoading={isLoading || isFetching}
      />

      <ConfirmDialog
        isOpen={!!deletingProduct}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Product"
        description={`Are you sure you want to delete the product "${deletingProduct?.name}"? This action cannot be undone.`}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
