"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { DataTable } from "@/components/ui/data-table";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

import {
  useGetApiV1Order,
  getGetApiV1OrderQueryKey,
  getApiV1OrderCancelOrderId, 
} from "@/api/generated/order/order";
import type { OrderDto } from "@/api/generated/model";

import { useErrorHandler } from "@/hooks/use-error-handling";
import { useDataTable } from "@/hooks/use-data-table";
import { getOrderColumns } from "./orders-table-columns";
import { OrderStatusModal } from "./order-status-modal";

export function OrdersPageClient() {
  const {
    currentPage,
    pageSize,
    globalFilter,
    debouncedGlobalFilter,
    setCurrentPage,
    setPageSize,
    setGlobalFilter,
  } = useDataTable();
  const [deletingOrder, setDeletingOrder] = useState<OrderDto | null>(null);
  const [editingOrder, setEditingOrder] = useState<OrderDto | null>(null);
  const { handleError } = useErrorHandler();

  const queryClient = useQueryClient();

  const queryKey = getGetApiV1OrderQueryKey({
    Page: currentPage,
    PageSize: pageSize,
    Search: debouncedGlobalFilter || undefined,
  });

  const {
    data: ordersResponse,
    isLoading,
    isFetching,
  } = useGetApiV1Order({
    Page: currentPage,
    PageSize: pageSize,
    Search: debouncedGlobalFilter || undefined,
  });

  const cancelMutation = useMutation({
    mutationFn: getApiV1OrderCancelOrderId,
    onSuccess: () => {
      toast.success("Order cancelled successfully");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      handleError(error);
    },
    onSettled: () => {
      setDeletingOrder(null);
    },
  });

  const handleDelete = () => {
    if (!deletingOrder?.id) return;
    cancelMutation.mutate(deletingOrder.id);
  };

  const handleEdit = (order: OrderDto) => {
    setEditingOrder(order);
  };

  const handleDeleteClick = (order: OrderDto) => {
    setDeletingOrder(order);
  };

  const handleCloseDeleteDialog = () => {
    setDeletingOrder(null);
  };

  const handleCloseEditModal = () => {
    setEditingOrder(null);
  };

  const columns = getOrderColumns({
    handleEdit,
    handleDeleteClick,
  });

  // @ts-ignore
  const pagedData = ordersResponse?.data;

  return (
    <>
      <OrderStatusModal
        order={editingOrder}
        isOpen={!!editingOrder}
        onClose={handleCloseEditModal}
      />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Package className="h-6 w-6" />
              Orders
            </h2>
            <p className="text-muted-foreground">Manage customer orders</p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={pagedData?.value ?? []}
          page={currentPage}
          pageSize={pageSize}
          totalPages={pagedData?.pagedInfo?.totalPages ?? 1}
          totalRecords={pagedData?.pagedInfo?.totalRecords ?? 0}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          isLoading={isLoading || isFetching}
        />

        <ConfirmDialog
          isOpen={!!deletingOrder}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleDelete}
          title="Cancel Order"
          description={`Are you sure you want to cancel this order?`}
          isPending={cancelMutation.isPending}
        />
      </div>
    </>
  );
}
