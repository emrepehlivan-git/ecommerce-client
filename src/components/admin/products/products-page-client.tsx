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

import { useErrorHandler } from "@/hooks/use-error-handling";
import { useDataTable } from "@/hooks/use-data-table";
import { getProductColumns } from "./products-table-columns";
import { useI18n } from "@/i18n/client";

export function ProductsPageClient() {
  const router = useRouter();
  const {
    currentPage,
    pageSize,
    globalFilter,
    debouncedGlobalFilter,
    setCurrentPage,
    setPageSize,
    setGlobalFilter,
  } = useDataTable();
  const [deletingProduct, setDeletingProduct] = useState<ProductDto | null>(null);
  const { handleError } = useErrorHandler();
  const t = useI18n();

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
            {t("admin.products.title")}
          </h2>
          <p className="text-muted-foreground">{t("admin.products.managementDesc")}</p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          {t("admin.products.newProduct")}
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={productsResponse?.value ?? []}
        page={currentPage}
        pageSize={pageSize}
        totalPages={productsResponse?.pagedInfo?.totalPages ?? 1}
        totalRecords={productsResponse?.pagedInfo?.totalRecords ?? 0}
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
        title={t("admin.products.deleteTitle")}
        description={t("admin.products.deleteDesc", { name: deletingProduct?.name })}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
