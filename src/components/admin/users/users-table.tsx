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
  usePostApiV1UsersActivateId, 
  usePostApiV1UsersDeactivateId 
} from "@/api/generated/users/users";
import { useQueryClient } from "@tanstack/react-query";

interface UsersTableProps {
  columns?: ColumnDef<UserDto>[];
  data: UserDto[];
  pagedInfo: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
  };
}

export function UsersTable({ columns: providedColumns, data, pagedInfo }: UsersTableProps) {
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

  // User activation/deactivation mutations
  const activateUserMutation = usePostApiV1UsersActivateId({
    mutation: {
      onSuccess: () => {
        toast.success("User activated successfully");
        queryClient.invalidateQueries({ queryKey: ["/api/v1/Users"] });
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.detail || "Failed to activate user");
      },
    },
  });

  const deactivateUserMutation = usePostApiV1UsersDeactivateId({
    mutation: {
      onSuccess: () => {
        toast.success("User deactivated successfully");
        queryClient.invalidateQueries({ queryKey: ["/api/v1/Users"] });
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.detail || "Failed to deactivate user");
      },
    },
  });

  // Event handlers
  const handleManageRoles = (user: UserDto) => {
    setSelectedUser(user);
    setIsRoleModalOpen(true);
  };

  const handleToggleStatus = async (user: UserDto) => {
    if (!user.id) return;

    try {
      if (user.isActive) {
        await deactivateUserMutation.mutateAsync({ id: user.id });
      } else {
        await activateUserMutation.mutateAsync({ id: user.id });
      }
    } catch (error) {
      // Error handling is done in the mutation callbacks
    }
  };

  // Create columns with action handlers
  const columns = providedColumns || createUserColumns({
    onManageRoles: handleManageRoles,
    onToggleStatus: handleToggleStatus,
  });

  return (
    <>
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
        isLoading={isSearching || activateUserMutation.isPending || deactivateUserMutation.isPending}
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
