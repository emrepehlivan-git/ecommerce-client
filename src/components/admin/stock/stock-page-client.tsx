"use client";

import { useState } from "react";
import { Package, AlertTriangle, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockUpdateModal } from "./stock-update-modal";

import {
  useGetApiV1Product,
  getGetApiV1ProductQueryKey,
} from "@/api/generated/product/product";
import type { ProductDto } from "@/api/generated/model";

import { useDataTable } from "@/hooks/use-data-table";
import { getStockColumns } from "./stock-table-columns";
import { useI18n } from "@/i18n/client";

export function StockPageClient() {
  const t = useI18n();
  const {
    currentPage,
    pageSize,
    globalFilter,
    debouncedGlobalFilter,
    setCurrentPage,
    setPageSize,
    setGlobalFilter,
  } = useDataTable();
  const [updatingProduct, setUpdatingProduct] = useState<ProductDto | null>(null);

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

  const handleStockUpdate = (product: ProductDto) => {
    setUpdatingProduct(product);
  };

  const handleCloseUpdateModal = () => {
    setUpdatingProduct(null);
  };

  const handleStockUpdateSuccess = () => {
    toast.success("Stock updated successfully");
    setUpdatingProduct(null);
    const queryKey = getGetApiV1ProductQueryKey({
      Page: currentPage,
      PageSize: pageSize,
      Search: debouncedGlobalFilter || undefined,
    });
    queryClient.invalidateQueries({ queryKey });
  };

  const columns = getStockColumns({
    handleStockUpdate,
  });

  const products = productsResponse?.value ?? [];
  
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => (p.stockQuantity || 0) <= 10).length;
  const outOfStockCount = products.filter(p => (p.stockQuantity || 0) === 0).length;
  const totalStockValue = products.reduce((sum, p) => sum + ((p.stockQuantity || 0) * (p.price || 0)), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-6 w-6" />
            {t("admin.stock.title")}
          </h2>
          <p className="text-muted-foreground">{t("admin.stock.description")}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.stock.totalProducts")}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">{t("admin.stock.totalProductsDesc")}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.stock.lowStock")}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">{t("admin.stock.lowStockDesc")}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.stock.outOfStock")}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockCount}</div>
            <p className="text-xs text-muted-foreground">{t("admin.stock.outOfStockDesc")}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.stock.stockValue")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺{totalStockValue.toLocaleString("tr-TR")}</div>
            <p className="text-xs text-muted-foreground">{t("admin.stock.stockValueDesc")}</p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={products}
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

      <StockUpdateModal
        product={updatingProduct}
        isOpen={!!updatingProduct}
        onClose={handleCloseUpdateModal}
        onSuccess={handleStockUpdateSuccess}
      />
    </div>
  );
}