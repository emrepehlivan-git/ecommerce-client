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
  t: (key: string) => string
}

export const createUserColumns = ({ onManageRoles, onToggleStatus, t }: UserColumnsProps): ColumnDef<UserDto>[] => {
  return [
    {
      accessorKey: "id",
      header: t("admin.users.table.id"),
      enableGlobalFilter: false,
    },
    {
      accessorKey: "fullName",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t("admin.users.table.fullName")} />,
      enableSorting: true,
      enableGlobalFilter: true,
    },
    {
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title={t("admin.users.table.email")} />,
      enableSorting: true,
      enableGlobalFilter: true,
    },
    {
      accessorKey: "isActive",
      header: t("admin.users.table.actions"),
      cell: ({ row }) => row.original.isActive ? 
        <Badge variant="outline">{t("admin.users.table.active")}</Badge> : 
        <Badge variant="destructive">{t("admin.users.table.inactive")}</Badge>,
    },
    {
      accessorKey: "birthday",
      header: t("admin.users.table.birthday"),
      cell: ({ row }) => row.original.birthday ? new Date(row.original.birthday).toLocaleDateString() : '-',
    },
    {
      id: "actions",
      header: t("admin.users.table.actions"),
      cell: ({ row }) => {
        const user = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">{t("admin.users.table.openMenu")}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("admin.users.table.actionsLabel")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                onManageRoles(user);
              }}>
                <Shield className="mr-2 h-4 w-4" />
                {t("admin.users.table.manageRoles")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                onToggleStatus(user);
              }}>
                {user.isActive ? (
                  <>
                    <UserX className="mr-2 h-4 w-4" />
                    {t("admin.users.table.deactivateUser")}
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    {t("admin.users.table.activateUser")}
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}

export const userColumns: ColumnDef<UserDto>[] = createUserColumns({
  onManageRoles: () => {},
  onToggleStatus: () => {},
  t: (key: string) => key,
}) 