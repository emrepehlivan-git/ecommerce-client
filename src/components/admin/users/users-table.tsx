"use client";

import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { UserDto } from "@/api/generated/model/userDto";
import { ColumnDef } from "@tanstack/react-table";
import { useTableParams } from "@/hooks/use-table-params";
import { UserRoleModal } from "./user-role-modal";
import { createUserColumns } from "./users-table-columns";
import { 
  getGetApiV1UsersQueryKey,
  usePostApiV1UsersActivateId, 
  usePostApiV1UsersDeactivateId,  
  useGetApiV1Users
} from "@/api/generated/users/users";
import { useQueryClient } from "@tanstack/react-query";
import { useT } from "@/i18n/getT";

interface UsersTableProps {
  columns?: ColumnDef<UserDto>[];
  page: number;
  pageSize: number;
  search?: string;
}

export function UsersTable({ columns: providedColumns, page, pageSize, search }: UsersTableProps) {
  const t = useT();
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const {
    globalFilter,
    isSearching,
    handlePageChange,
    handlePageSizeChange,
    handleFilterChange,
  } = useTableParams();

  const { data, isLoading: isUsersLoading } = useGetApiV1Users({
    Page: page,
    PageSize: pageSize,
    Search: search,
  });

  const activateUserMutation = usePostApiV1UsersActivateId({
    mutation: {
      onSuccess: () => {
        toast.success(t("admin.users.table.userActivatedSuccess"));
        queryClient.invalidateQueries({ queryKey: getGetApiV1UsersQueryKey({ Page: page, PageSize: pageSize, Search: search }) });
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.detail || error?.message || t("admin.users.table.userActivationError"));
      },
    },
  });

  const deactivateUserMutation = usePostApiV1UsersDeactivateId({
    mutation: {
      onSuccess: () => {
        toast.success(t("admin.users.table.userDeactivatedSuccess"));
        queryClient.invalidateQueries({ queryKey: getGetApiV1UsersQueryKey({ Page: page, PageSize: pageSize, Search: search }) });
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.detail || error?.message || t("admin.users.table.userDeactivationError"));
      },
    },
  });

  const handleManageRoles = (user: UserDto) => {
    setSelectedUser(user);
    setIsRoleModalOpen(true);
  };

  const handleToggleStatus = async (user: UserDto) => {
    if (!user.id) {
      return;
    }
    try {
      if (user.isActive) {
        await deactivateUserMutation.mutateAsync({ id: user.id });
      } else {
        await activateUserMutation.mutateAsync({ id: user.id });
      }
    } catch (error) {}
  };

  const columns = providedColumns || createUserColumns({
    onManageRoles: handleManageRoles,
    onToggleStatus: handleToggleStatus,
    t,
  });

  const pagedInfo = data?.pagedInfo || { pageNumber: page, pageSize, totalPages: 1, totalRecords: 0 };
  const users = data?.value || [];

  return (
    <>
      <DataTable
        columns={columns}
        data={users}
        page={pagedInfo.pageNumber ?? 1}
        pageSize={pagedInfo.pageSize ?? 10}
        totalPages={pagedInfo.totalPages ?? 1}
        totalRecords={pagedInfo.totalRecords ?? 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        globalFilter={globalFilter}
        onGlobalFilterChange={handleFilterChange}
        isLoading={isSearching || isUsersLoading || activateUserMutation.isPending || deactivateUserMutation.isPending}
      />
      <UserRoleModal
        user={selectedUser}
        isOpen={isRoleModalOpen}
        onClose={() => {
          setIsRoleModalOpen(false);
          setSelectedUser(null);
        }}
      />
    </>
  );
}
