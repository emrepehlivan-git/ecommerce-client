"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  getFilteredRowModel,
  PaginationState,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { DataTableToolbar } from "./data-table-toolbar"
import { DataTablePagination } from "./data-table-pagination"

export interface DataTableState {
  pagination: PaginationState
  globalFilter: string
}
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  page: number
  pageSize: number
  totalPages: number
  totalRecords: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  globalFilter: string
  onGlobalFilterChange: (filter: string) => void
  isLoading?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  page,
  pageSize,
  totalPages,
  totalRecords,
  onPageChange,
  onPageSizeChange,
  globalFilter,
  onGlobalFilterChange,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const pagination = React.useMemo(
    () => ({
      pageIndex: page - 1,
      pageSize,
    }),
    [page, pageSize],
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      globalFilter,
    },
    manualPagination: true,
    manualFiltering: true,
    pageCount: totalPages,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === "function" ? updater(pagination) : updater

      if (newPagination.pageSize !== pagination.pageSize) {
        onPageSizeChange(newPagination.pageSize)
      } else if (newPagination.pageIndex !== pagination.pageIndex) {
        onPageChange(newPagination.pageIndex + 1)
      }
    },
    onGlobalFilterChange: onGlobalFilterChange,
  })

  return (
    <div className="w-full space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize || 10 }, (_, index) => (
                <TableRow key={index}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex} className="p-4">
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} rowCount={totalRecords} />
    </div>
  )
} 