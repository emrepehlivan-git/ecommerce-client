"use client"

import { DataTable } from "@/components/ui/data-table"
import { RoleDto } from "@/api/generated/model"
import { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { useGetApiRole, useDeleteApiRoleId } from "@/api/generated/role/role"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Trash } from "lucide-react"

interface RolesTableProps {
  columns: ColumnDef<RoleDto>[]
}

export function RolesTable({ columns }: RolesTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [globalFilter, setGlobalFilter] = useState("")
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({})
  const debouncedFilter = useDebounce(globalFilter, 500)

  const { data, isLoading, isFetching, refetch } = useGetApiRole(
    {
      Page: currentPage,
      PageSize: pageSize,
      Search: debouncedFilter,
    },
    {
      query: {
        select: (data) => data.data as any,
      },
    }
  )

  const roles = data?.value ?? []
  const totalRecords = data?.pagedInfo?.totalRecords ?? 0
  const totalPages = data?.pagedInfo?.totalPages ?? 1

  const selectedRoleIds = Object.keys(rowSelection)
    .filter((key) => rowSelection[key])
    .map((key) => roles[Number(key)]?.id)
    .filter(Boolean)

  const deleteMutation = useDeleteApiRoleId()

  const handleDeleteSelected = async () => {
    for (const id of selectedRoleIds) {
      await deleteMutation.mutateAsync({ id })
    }
    setRowSelection({})
    refetch()
  }

  return (
    <div className="space-y-4">
      {selectedRoleIds.length > 0 && (
        <div className="flex items-center gap-2">
          <span>{selectedRoleIds.length} roles selected</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">Bulk Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={handleDeleteSelected}
                disabled={deleteMutation.isPending}
                className="text-destructive"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Selected Roles
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      <DataTable
        columns={columns}
        data={roles}
        page={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        isLoading={isLoading || isFetching}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />
    </div>
  )
} 