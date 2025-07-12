"use client";

import { DataTable } from "@/components/ui/data-table";
import { RoleDto } from "@/api/generated/model";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useGetApiV1Role } from "@/api/generated/role/role";

interface RolesTableProps {
  columns: ColumnDef<RoleDto>[];
}

export function RolesTable({ columns }: RolesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const debouncedFilter = useDebounce(globalFilter, 500);

  const { data, isLoading, isFetching } = useGetApiV1Role(
    {
      Page: currentPage,
      PageSize: pageSize,
      Search: debouncedFilter,
    },
  );

  return (
    <DataTable
      columns={columns}
      data={data?.value ?? []}
      page={currentPage}
      pageSize={pageSize}
      totalPages={data?.pagedInfo?.totalPages ?? 1}
      totalRecords={data?.pagedInfo?.totalRecords ?? 0}
      onPageChange={setCurrentPage}
      onPageSizeChange={setPageSize}
      globalFilter={globalFilter}
      onGlobalFilterChange={setGlobalFilter}
      isLoading={isLoading || isFetching}
      rowSelection={rowSelection}
      onRowSelectionChange={setRowSelection}
    />
  );
}
