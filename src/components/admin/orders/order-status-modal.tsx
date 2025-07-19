"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderDto, OrderStatus, OrderStatusUpdateCommand } from "@/api/generated/model";
import { useForm, Controller } from "react-hook-form";
import { usePostApiV1OrderStatusOrderId } from "@/api/generated/order/order";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { getGetApiV1OrderQueryKey } from "@/api/generated/order/order";
import { useErrorHandler } from "@/hooks/use-error-handling";
import { useI18n } from "@/i18n/client";

interface OrderStatusModalProps {
  order: OrderDto | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusTransitions: Record<number, number[]> = {
  [OrderStatus.NUMBER_0]: [OrderStatus.NUMBER_1, OrderStatus.NUMBER_4],
  [OrderStatus.NUMBER_1]: [OrderStatus.NUMBER_2, OrderStatus.NUMBER_4],
  [OrderStatus.NUMBER_2]: [OrderStatus.NUMBER_3],
  [OrderStatus.NUMBER_3]: [],
  [OrderStatus.NUMBER_4]: [],
};

const getStatusLabels = (t: any): Record<number, string> => ({
  [OrderStatus.NUMBER_0]: t("admin.orders.statusModal.statusLabels.pending"),
  [OrderStatus.NUMBER_1]: t("admin.orders.statusModal.statusLabels.processing"),
  [OrderStatus.NUMBER_2]: t("admin.orders.statusModal.statusLabels.shipped"),
  [OrderStatus.NUMBER_3]: t("admin.orders.statusModal.statusLabels.delivered"),
  [OrderStatus.NUMBER_4]: t("admin.orders.statusModal.statusLabels.cancelled"),
});

const getStatusDescription = (status: number, t: any): string => {
  switch (status) {
    case OrderStatus.NUMBER_0:
      return t("admin.orders.statusModal.statusDescriptions.pending");
    case OrderStatus.NUMBER_1:
      return t("admin.orders.statusModal.statusDescriptions.processing");
    case OrderStatus.NUMBER_2:
      return t("admin.orders.statusModal.statusDescriptions.shipped");
    case OrderStatus.NUMBER_3:
      return t("admin.orders.statusModal.statusDescriptions.delivered");
    case OrderStatus.NUMBER_4:
      return t("admin.orders.statusModal.statusDescriptions.cancelled");
    default:
      return t("admin.orders.statusModal.statusDescriptions.unknown");
  }
};

export function OrderStatusModal({ order, isOpen, onClose }: OrderStatusModalProps) {
  const t = useI18n();
  const { control, handleSubmit, watch, reset } = useForm<{ newStatus: string }>();
  const { handleError } = useErrorHandler();
  const queryClient = useQueryClient();
  const currentStatus = watch("newStatus");

  const { mutate, isPending } = usePostApiV1OrderStatusOrderId({
    mutation: {
      onSuccess: () => {
        toast.success(t("admin.orders.statusModal.updateSuccess"));
        queryClient.invalidateQueries({ queryKey: getGetApiV1OrderQueryKey() });
        onClose();
        reset();
      },
      onError: (error) => handleError(error),
    },
  });

  const onSubmit = (data: { newStatus: string }) => {
    if (!order?.id) return;
    const command: OrderStatusUpdateCommand = {
      orderId: order.id,
      newStatus: parseInt(data.newStatus, 10) as OrderStatus,
    };
    mutate({ orderId: order.id, data: command });
  };

  const availableStatuses = order?.status !== undefined ? statusTransitions[order.status] ?? [] : [];
  const isFinalState = order?.status !== undefined && availableStatuses.length === 0;
  const statusLabels = getStatusLabels(t);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("admin.orders.statusModal.title")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>{t("admin.orders.statusModal.currentStatus")}</Label>
            <p className="font-semibold">
              {order?.status !== undefined ? statusLabels[order.status] : "N/A"}
            </p>
            {order?.status !== undefined && (
              <p className="text-sm text-muted-foreground">
                {getStatusDescription(order.status, t)}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="newStatus">{t("admin.orders.statusModal.newStatus")}</Label>
            {!isFinalState ? (
              <Controller
                name="newStatus"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("admin.orders.statusModal.selectPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStatuses.map((status) => (
                        <SelectItem key={status} value={status.toString()}>
                          {statusLabels[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            ) : (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  {t("admin.orders.statusModal.finalStateMessage", { status: order?.status !== undefined ? statusLabels[order.status] : "" })}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={handleClose}>{t("admin.orders.statusModal.cancelButton")}</Button>
            </DialogClose>
            {!isFinalState && (
              <Button type="submit" disabled={isPending || !currentStatus}>
                {isPending ? t("admin.orders.statusModal.savingButton") : t("admin.orders.statusModal.saveButton")}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
