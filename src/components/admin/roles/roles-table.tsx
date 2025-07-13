"use client";

import { DataTable } from "@/components/ui/data-table";
import { PagedInfo, RoleDto } from "@/api/generated/model";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useTableParams } from "@/hooks/use-table-params";

interface RolesTableProps {
  columns: ColumnDef<RoleDto>[];
  roles: RoleDto[];
  pagedInfo: PagedInfo;
  isLoading: boolean;
}

export function RolesTable({roles, columns, pagedInfo, isLoading }: RolesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const {
    globalFilter,
    isSearching,
    handlePageChange,
    handlePageSizeChange,
    handleFilterChange,
  } = useTableParams();

  return (
    <DataTable
      columns={columns}
      data={roles}
      page={currentPage}
      pageSize={pageSize}
      totalPages={pagedInfo.totalPages ?? 1}
      totalRecords={pagedInfo.totalRecords ?? 0}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      globalFilter={globalFilter}
      onGlobalFilterChange={handleFilterChange}
      isLoading={isLoading || isSearching}
      rowSelection={rowSelection}
      onRowSelectionChange={setRowSelection}
    />
  );
}
