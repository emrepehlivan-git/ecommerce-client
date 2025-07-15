"use client"

import { ColumnDef } from "@tanstack/react-table"
import { UserDto } from '@/api/generated/model/userDto'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Shield, UserCheck, UserX } from "lucide-react"

interface UserColumnsProps {
  onManageRoles: (user: UserDto) => void
  onToggleStatus: (user: UserDto) => void
}

export const createUserColumns = ({ onManageRoles, onToggleStatus }: UserColumnsProps): ColumnDef<UserDto>[] => [
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
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original

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
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onManageRoles(user)}>
              <Shield className="mr-2 h-4 w-4" />
              Manage Roles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleStatus(user)}>
              {user.isActive ? (
                <>
                  <UserX className="mr-2 h-4 w-4" />
                  Deactivate User
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Activate User
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

// Legacy export for backward compatibility
export const userColumns: ColumnDef<UserDto>[] = createUserColumns({
  onManageRoles: () => {},
  onToggleStatus: () => {},
}) 