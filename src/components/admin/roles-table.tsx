"use client"

import { DataTable } from "@/components/ui/data-table"
import { RoleDto } from "@/api/generated/model"
import { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { useGetApiRole } from "@/api/generated/role/role"
import { DataTableState } from "@/components/ui/data-table"

interface RolesTableProps {
  columns: ColumnDef<RoleDto>[]
}

export function RolesTable({ columns }: RolesTableProps) {
  const [pagination, setPagination] = useState<DataTableState["pagination"]>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [globalFilter, setGlobalFilter] = useState<DataTableState["globalFilter"]>("")
  const debouncedFilter = useDebounce(globalFilter, 500)

  const { data, isLoading } = useGetApiRole(
    {
      Page: pagination.pageIndex + 1,
      PageSize: pagination.pageSize,
      Search: debouncedFilter,
    },
    {
      query: {
        select: (data) => data.data as any,
      },
    }
  )

  const handleStateChange = (state: DataTableState) => {
    setPagination(state.pagination)
    setGlobalFilter(state.globalFilter)
  }

  return (
    <DataTable
      columns={columns}
      data={data?.value ?? []}
      state={{ pagination, globalFilter }}
      onStateChange={handleStateChange}
      pageCount={data?.pagedInfo?.totalPages ?? 0}
      rowCount={data?.pagedInfo?.totalRecords ?? 0}
      isLoading={isLoading}
    />
  )
} 