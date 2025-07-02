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
import { useErrorHandler } from "@/lib/hooks/useErrorHandler";

interface OrderStatusModalProps {
  order: OrderDto | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusTransitions: Record<number, number[]> = {
  [OrderStatus.NUMBER_0]: [OrderStatus.NUMBER_1, OrderStatus.NUMBER_4], // Pending -> Processing, Cancelled
  [OrderStatus.NUMBER_1]: [OrderStatus.NUMBER_2, OrderStatus.NUMBER_4], // Processing -> Shipped, Cancelled
  [OrderStatus.NUMBER_2]: [OrderStatus.NUMBER_3], // Shipped -> Delivered
};

const statusLabels: Record<number, string> = {
  [OrderStatus.NUMBER_0]: "Pending",
  [OrderStatus.NUMBER_1]: "Processing",
  [OrderStatus.NUMBER_2]: "Shipped",
  [OrderStatus.NUMBER_3]: "Delivered",
  [OrderStatus.NUMBER_4]: "Cancelled",
};

export function OrderStatusModal({ order, isOpen, onClose }: OrderStatusModalProps) {
  const { control, handleSubmit, watch } = useForm<{ newStatus: string }>();
  const { handleError } = useErrorHandler();
  const queryClient = useQueryClient();
  const currentStatus = watch("newStatus");

  const { mutate, isPending } = usePostApiV1OrderStatusOrderId({
    mutation: {
      onSuccess: () => {
        toast.success("Order status updated successfully");
        queryClient.invalidateQueries({ queryKey: getGetApiV1OrderQueryKey() });
        onClose();
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

  const availableStatuses = order?.status ? statusTransitions[order.status] ?? [] : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Current Status</Label>
            <p className="font-semibold">{order?.status ? statusLabels[order.status] : "N/A"}</p>
          </div>
          <div>
            <Label htmlFor="newStatus">New Status</Label>
            <Controller
              name="newStatus"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a new status" />
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
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending || !currentStatus}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
