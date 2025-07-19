"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/confirm-dialog";

import {
  useGetApiV1Category,
  usePostApiV1Category,
  usePutApiV1CategoryId,
  useDeleteApiV1CategoryId,
  getGetApiV1CategoryQueryKey,
} from "@/api/generated/category/category";
import type {
  CategoryDto,
  CreateCategoryCommand,
  UpdateCategoryCommand,
} from "@/api/generated/model";

import { CategoryFormModal } from "@/components/admin/categories/category-form-modal";
import { useErrorHandler } from "@/hooks/use-error-handling";
import { useDataTable } from "@/hooks/use-data-table";
import { getCategoryColumns } from "./categories-table-columns";
import { useI18n } from "@/i18n/client";

export function CategoryPageClient() {
  const t = useI18n();
  const {
    currentPage,
    pageSize,
    globalFilter,
    debouncedGlobalFilter,
    setCurrentPage,
    setPageSize,
    setGlobalFilter,
  } = useDataTable();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryDto | null>(null);
  const { handleError } = useErrorHandler();

  const queryClient = useQueryClient();

  const {
    data: categoriesResponse,
    isLoading,
    isFetching,
  } = useGetApiV1Category({
    Page: currentPage,
    PageSize: pageSize,
    Search: debouncedGlobalFilter || undefined,
  });

  const queryKey = getGetApiV1CategoryQueryKey({
    Page: currentPage,
    PageSize: pageSize,
    Search: debouncedGlobalFilter || undefined,
  });

  const createMutation = usePostApiV1Category({
    mutation: {
      onSuccess: () => {
        toast.success("Category created successfully");
        setIsFormModalOpen(false);
        setEditingCategory(null);
        queryClient.invalidateQueries({ queryKey });
      },
      onError: (error) => {
        handleError(error);
      },
    },
  });

  const updateMutation = usePutApiV1CategoryId({
    mutation: {
      onSuccess: () => {
        toast.success("Category updated successfully");
        setIsFormModalOpen(false);
        setEditingCategory(null);
        queryClient.invalidateQueries({ queryKey });
      },
      onError: (error) => {
        handleError(error);
      },
    },
  });

  const deleteMutation = useDeleteApiV1CategoryId({
    mutation: {
      onSuccess: () => {
        toast.success("Category deleted successfully");
        setDeletingCategory(null);
        queryClient.invalidateQueries({ queryKey });
      },
      onError: (error) => {
        handleError(error);
      },
    },
  });

  const handleCreate = (data: CreateCategoryCommand) => {
    createMutation.mutate({ data });
  };

  const handleUpdate = (data: UpdateCategoryCommand) => {
    if (!editingCategory?.id) return;
    updateMutation.mutate({
      id: editingCategory.id,
      data: { ...data, id: editingCategory.id },
    });
  };

  const handleDelete = () => {
    if (!deletingCategory?.id) return;
    deleteMutation.mutate({ id: deletingCategory.id });
  };

  const handleEdit = (category: CategoryDto) => {
    setEditingCategory(category);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (category: CategoryDto) => {
    setDeletingCategory(category);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setIsFormModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsFormModalOpen(false);
    setEditingCategory(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeletingCategory(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("admin.categories.title")}</h2>
          <p className="text-muted-foreground">{t("admin.categories.managementDesc")}</p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          {t("admin.categories.newCategory")}
        </Button>
      </div>

      <DataTable
        columns={getCategoryColumns({
          handleEdit,
          handleDeleteClick,
        })}
        data={categoriesResponse?.value ?? []}
        page={currentPage}
        pageSize={pageSize}
        totalPages={categoriesResponse?.pagedInfo?.totalPages ?? 1}
        totalRecords={categoriesResponse?.pagedInfo?.totalRecords ?? 0}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        isLoading={isLoading || isFetching}
      />

      <CategoryFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingCategory ? handleUpdate : handleCreate}
        initialData={editingCategory}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={!!deletingCategory}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDelete}
        title={t("admin.categories.deleteTitle")}
        description={t("admin.categories.deleteDesc", { name: deletingCategory?.name })}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
