"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
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

type GetOrderColumnsProps = {
  handleEdit: (order: OrderDto) => void;
  handleDeleteClick: (order: OrderDto) => void;
};

export function getOrderColumns({
  handleEdit,
  handleDeleteClick,
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
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div className="text-right font-medium">{formatted}</div>;
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
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEdit(order)}>
                <Pencil className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDeleteClick(order)} variant="destructive">
                <Trash className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
