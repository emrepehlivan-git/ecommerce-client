"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/common/confirm-dialog"

import { 
  useGetApiCategory,
  usePostApiCategory,
  usePutApiCategoryId,
  useDeleteApiCategoryId,
  getGetApiCategoryQueryKey
} from "@/api/generated/category/category"
import type { CategoryDto, CreateCategoryCommand, UpdateCategoryCommand } from "@/api/generated/model"

import { CategoryFormModal } from "@/components/admin/categories/category-form-modal"
import { useErrorHandler } from "@/lib/hooks/useErrorHandler"
import { useDebounce } from "@/hooks/use-debounce"
import { getCategoryColumns } from "./categories-table-columns"

export function CategoryPageClient() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [globalFilter, setGlobalFilter] = useState("")
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<CategoryDto | null>(null)
  const { handleError } = useErrorHandler()
  const debouncedGlobalFilter = useDebounce(globalFilter)

  const queryClient = useQueryClient()

  const { data: categoriesResponse, isLoading, isFetching } = useGetApiCategory({
    Page: currentPage,
    PageSize: pageSize,
    Search: debouncedGlobalFilter || undefined,
  })

  const queryKey = getGetApiCategoryQueryKey({
    Page: currentPage,
    PageSize: pageSize,
    Search: debouncedGlobalFilter || undefined,
  })

  const createMutation = usePostApiCategory({
    mutation: {
      onSuccess: () => {
        toast.success("Category created successfully")
        setIsFormModalOpen(false)
        setEditingCategory(null)
        queryClient.invalidateQueries({ queryKey })
      },
      onError: (error) => {
        handleError(error)
      },
    },
  })

  const updateMutation = usePutApiCategoryId({
    mutation: {
      onSuccess: () => {
        toast.success("Category updated successfully")
        setIsFormModalOpen(false)
        setEditingCategory(null)
        queryClient.invalidateQueries({ queryKey })
      },
      onError: (error) => {
        handleError(error)
      },
    },
  })

  const deleteMutation = useDeleteApiCategoryId({
    mutation: {
      onSuccess: () => {
        toast.success("Category deleted successfully")
        setDeletingCategory(null)
        queryClient.invalidateQueries({ queryKey })
      },
      onError: (error) => {
        handleError(error)
      },
    },
  })

  const handleCreate = (data: CreateCategoryCommand) => {
    createMutation.mutate({ data })
  }

  const handleUpdate = (data: UpdateCategoryCommand) => {
    if (!editingCategory?.id) return
    updateMutation.mutate({ 
      id: editingCategory.id, 
      data: { ...data, id: editingCategory.id } 
    })
  }

  const handleDelete = () => {
    if (!deletingCategory?.id) return
    deleteMutation.mutate({ id: deletingCategory.id })
  }

  const handleEdit = (category: CategoryDto) => {
    setEditingCategory(category)
    setIsFormModalOpen(true)
  }

  const handleDeleteClick = (category: CategoryDto) => {
    setDeletingCategory(category)
  }

  const handleAddNew = () => {
    setEditingCategory(null)
    setIsFormModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsFormModalOpen(false)
    setEditingCategory(null)
  }

  const handleCloseDeleteDialog = () => {
    setDeletingCategory(null)
  }

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id)
    toast.success("ID copied to clipboard")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">
            Manage product categories
          </p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          New Category
        </Button>
      </div>

      <DataTable
        columns={getCategoryColumns({
          handleEdit,
          handleDeleteClick,
          handleCopyId,
        })}
        data={categoriesResponse?.data?.value ?? []}
        page={currentPage}
        pageSize={pageSize}
        totalPages={categoriesResponse?.data?.pagedInfo?.totalPages ?? 1}
        totalRecords={categoriesResponse?.data?.pagedInfo?.totalRecords ?? 0}
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
        title="Delete Category"
        description={`Are you sure you want to delete the category "${deletingCategory?.name}"? This action cannot be undone.`}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
} 