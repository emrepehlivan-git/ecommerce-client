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
import { useI18n } from "@/i18n/client";
import { useT } from "@/i18n/getT";

export function OrdersPageClient() {
  const t = useT();
  const {
    currentPage,
    pageSize,
    globalFilter,
    debouncedGlobalFilter,
    setCurrentPage,
    setPageSize,
    setGlobalFilter,
  } = useDataTable();
  const [cancellingOrder, setCancellingOrder] = useState<OrderDto | null>(null);
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
      toast.success(t("admin.orders.orderCancelledSuccessfully"));
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      handleError(error);
    },
    onSettled: () => {
      setCancellingOrder(null);
    },
  });

  const handleCancel = () => {
    if (!cancellingOrder?.id) return;
    cancelMutation.mutate(cancellingOrder.id);
  };

  const handleEdit = (order: OrderDto) => {
    setEditingOrder(order);
  };

  const handleCancelClick = (order: OrderDto) => {
    setCancellingOrder(order);
  };

  const handleCloseCancelDialog = () => {
    setCancellingOrder(null);
  };

  const handleCloseEditModal = () => {
    setEditingOrder(null);
  };

  const columns = getOrderColumns({
    handleEdit,
    handleCancelClick,
    t,
  });

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
              {t("admin.orders.title")}
            </h2>
            <p className="text-muted-foreground">{t("admin.orders.manageCustomerOrders")}</p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={ordersResponse?.value ?? []}
          page={currentPage}
          pageSize={pageSize}
          totalPages={ordersResponse?.pagedInfo?.totalPages ?? 1}
          totalRecords={ordersResponse?.pagedInfo?.totalRecords ?? 0}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          isLoading={isLoading || isFetching}
        />

        <ConfirmDialog
          isOpen={!!cancellingOrder}
          onClose={handleCloseCancelDialog}
          onConfirm={handleCancel}
          title={t("admin.orders.cancelOrder")}
          description={t("admin.orders.cancelOrderDescription")}
          isPending={cancelMutation.isPending}
        />
      </div>
    </>
  );
}
