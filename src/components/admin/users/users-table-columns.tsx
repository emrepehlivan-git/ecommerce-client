"use client"

import { ColumnDef } from "@tanstack/react-table"
import { UserDto } from '@/api/generated/model/userDto'
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

export const userColumns: ColumnDef<UserDto>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableGlobalFilter: false,
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Full Name" />,
    enableSorting: true,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    enableSorting: true,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => row.original.isActive ? <Badge variant="outline">Active</Badge> : <Badge variant="destructive">Inactive</Badge>,
  },
  {
    accessorKey: "birthday",
    header: "Birthday",
    cell: ({ row }) => row.original.birthday ? new Date(row.original.birthday).toLocaleDateString() : '-',
  },
] 