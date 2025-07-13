"use client";

import { RoleDto } from "@/api/generated/model";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  useDeleteApiV1RoleId,
  getGetApiV1RoleQueryKey,
  usePostApiV1RoleDeleteMany,
} from "@/api/generated/role/role";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useErrorHandler } from "@/hooks/use-error-handling";
import { useState } from "react";
import { RoleFormModal } from "./role-form-modal";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import React from "react";
import { CopyButton } from "@/components/ui/copy-button";

const RoleActions = ({ role }: { role: RoleDto }) => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();
  const deleteRoleMutation = useDeleteApiV1RoleId({
    mutation: {
      onSuccess: () => {
        toast.success("Role deleted successfully");
        queryClient.invalidateQueries({ queryKey: getGetApiV1RoleQueryKey() });
      },
      onError: (error) => {
        handleError(error);
      },
      onSettled: () => {
        setIsConfirmModalOpen(false);
      },
    },
  });

  const handleDelete = () => {
    if (!role.id) return;
    deleteRoleMutation.mutate({ id: role.id });
  };

  return (
    <>
      <RoleFormModal
        role={role}
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
      />
      <ConfirmDialog
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDelete}
        title="Are you sure?"
        description="This action cannot be undone. This will permanently delete the role."
        isPending={deleteRoleMutation.isPending}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setIsFormModalOpen(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsConfirmModalOpen(true)} variant="destructive">
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const columns: ColumnDef<RoleDto>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue<string>("id");
      return (
        <div className="flex items-center gap-2">
          <CopyButton value={id} className="h-5 w-5 p-0 mr-1" />
          <span className="font-mono text-xs">{id.slice(0, 8)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "actions",
    header: function ActionsHeader({ table }) {
      const selectedRows = table.getSelectedRowModel().rows;
      const hasSelection = selectedRows.length > 0;
      const queryClient = useQueryClient();
      const { handleError } = useErrorHandler();
      const [isBulkConfirmOpen, setIsBulkConfirmOpen] = React.useState(false);
      const deleteRolesMutation = usePostApiV1RoleDeleteMany({
        mutation: {
          onSuccess: () => {
            toast.success("Selected roles deleted successfully");
            queryClient.invalidateQueries({ queryKey: getGetApiV1RoleQueryKey() });
            table.resetRowSelection();
          },
          onError: (error) => {
            handleError(error);
          },
          onSettled: () => {
            setIsBulkConfirmOpen(false);
          },
        },
      });

      const handleBulkDelete = () => {
        const ids = selectedRows.map((row) => row.original.id).filter((id): id is string => !!id);
        if (ids.length === 0) return;
        deleteRolesMutation.mutate({ data: ids });
      };

      return (
        <>
          <ConfirmDialog
            isOpen={isBulkConfirmOpen}
            onClose={() => setIsBulkConfirmOpen(false)}
            onConfirm={handleBulkDelete}
            title="Are you sure?"
            description="This action cannot be undone. This will permanently delete the selected roles."
            isPending={deleteRolesMutation.isPending}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!hasSelection}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setIsBulkConfirmOpen(true)}
                disabled={!hasSelection}
                variant="destructive"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Selected Roles
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
    cell: ({ row }) => <RoleActions role={row.original} />,
  },
];
