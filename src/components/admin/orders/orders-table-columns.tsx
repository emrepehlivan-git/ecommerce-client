"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { CircleX, MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { OrderDto } from "@/api/generated/model";
import { OrderStatus } from "@/api/generated/model";
import { formatPrice } from "@/lib/formatPrice";

type GetOrderColumnsProps = {
  handleEdit: (order: OrderDto) => void;
  handleCancelClick: (order: OrderDto) => void;
  t: (key: string) => string;
};

const statusLabels: Record<number, string> = {
  [OrderStatus.NUMBER_0]: "Pending",
  [OrderStatus.NUMBER_1]: "Processing",
  [OrderStatus.NUMBER_2]: "Shipped",
  [OrderStatus.NUMBER_3]: "Delivered",
  [OrderStatus.NUMBER_4]: "Cancelled",
};

const statusVariants: Record<number, "default" | "secondary" | "destructive" | "outline"> = {
  [OrderStatus.NUMBER_0]: "secondary",
  [OrderStatus.NUMBER_1]: "default",
  [OrderStatus.NUMBER_2]: "default",
  [OrderStatus.NUMBER_3]: "outline",
  [OrderStatus.NUMBER_4]: "destructive",
};

export function getOrderColumns({
  handleEdit,
  handleCancelClick,
  t,
}: GetOrderColumnsProps): ColumnDef<OrderDto>[] {
  return [
    {
      accessorKey: "id",
      header: "Order ID",
    },
    {
      accessorKey: "userId",
      header: "User ID",
    },
    {
      accessorKey: "orderDate",
      header: "Order Date",
      cell: ({ row }) => {
        const orderDate = row.original.orderDate;
        return orderDate ? new Date(orderDate).toLocaleDateString() : "N/A";
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue<number>("status");
        if (status === undefined || status === null) return "N/A";
        
        return (
          <Badge variant={statusVariants[status] || "outline"}>
            {statusLabels[status] || status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("totalAmount"));
        return <div className="text-right font-medium">{formatPrice(amount)}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("admin.orders.actions")}</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEdit(order)}>
                <Pencil className="mr-2 size-4" />
                {t("admin.orders.edit")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleCancelClick(order)} variant="destructive">
                <CircleX className="mr-2 size-4" />
                {t("admin.orders.cancelOrder")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
