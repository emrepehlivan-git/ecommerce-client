"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { CircleX, MoreHorizontal, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { OrderDto } from "@/api/generated/model";
import { formatPrice } from "@/lib/formatPrice";

type GetOrderColumnsProps = {
  handleEdit: (order: OrderDto) => void;
  handleCancelClick: (order: OrderDto) => void;
  t: (key: string) => string;
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
