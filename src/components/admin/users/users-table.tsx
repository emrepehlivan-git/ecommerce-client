"use client";

import { DataTable } from "@/components/ui/data-table";
import { UserDto } from "@/api/generated/model/userDto";
import { ColumnDef } from "@tanstack/react-table";
import { useTableParams } from "@/hooks/use-table-params";

interface UsersTableProps {
  columns: ColumnDef<UserDto>[];
  data: UserDto[];
  pagedInfo: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
  };
}

export function UsersTable({ columns, data, pagedInfo }: UsersTableProps) {
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
      data={data}
      page={pagedInfo.pageNumber}
      pageSize={pagedInfo.pageSize}
      totalPages={pagedInfo.totalPages}
      totalRecords={pagedInfo.totalRecords}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      globalFilter={globalFilter}
      onGlobalFilterChange={handleFilterChange}
      isLoading={isSearching}
    />
  );
}
