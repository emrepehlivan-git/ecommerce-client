"use client";

import { useState } from "react";
import { Package, AlertTriangle, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StockUpdateModal } from "./stock-update-modal";

import {
  useGetApiV1Product,
  getGetApiV1ProductQueryKey,
} from "@/api/generated/product/product";
import type { ProductDto } from "@/api/generated/model";

import { useErrorHandler } from "@/hooks/use-error-handling";
import { useDataTable } from "@/hooks/use-data-table";
import { getStockColumns } from "./stock-table-columns";

export function StockPageClient() {
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
  const { handleError } = useErrorHandler();

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
  
  // Calculate stock statistics
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
            Stock Management
          </h2>
          <p className="text-muted-foreground">Monitor and manage product inventory levels</p>
        </div>
      </div>

      {/* Stock Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active products in inventory</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Products with ≤10 units</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockCount}</div>
            <p className="text-xs text-muted-foreground">Products with 0 units</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺{totalStockValue.toLocaleString("tr-TR")}</div>
            <p className="text-xs text-muted-foreground">Total inventory value</p>
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