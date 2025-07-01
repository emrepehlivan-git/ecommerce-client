"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, Copy, Package } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/common/confirm-dialog"

import { 
  useGetApiProduct,
  useDeleteApiProductId,
  getGetApiProductQueryKey
} from "@/api/generated/product/product"
import type { ProductDto } from "@/api/generated/model"

import { useErrorHandler } from "@/lib/hooks/useErrorHandler"
import { Hint } from "@/components/ui/hint"
import { useDebounce } from "@/hooks/use-debounce"

export function ProductsPageClient() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [globalFilter, setGlobalFilter] = useState("")
  const [deletingProduct, setDeletingProduct] = useState<ProductDto | null>(null)
  const { handleError } = useErrorHandler()
  const debouncedGlobalFilter = useDebounce(globalFilter)

  const queryClient = useQueryClient()

  const { data: productsResponse, isLoading, isFetching } = useGetApiProduct({
    Page: currentPage,
    PageSize: pageSize,
    Search: debouncedGlobalFilter || undefined,
  })

  const queryKey = getGetApiProductQueryKey({
    Page: currentPage,
    PageSize: pageSize,
    Search: debouncedGlobalFilter || undefined,
  })

  const deleteMutation = useDeleteApiProductId({
    mutation: {
      onSuccess: () => {
        toast.success("Product deleted successfully")
        setDeletingProduct(null)
        queryClient.invalidateQueries({ queryKey })
      },
      onError: (error) => {
        handleError(error)
      },
    },
  })

  const handleDelete = () => {
    if (!deletingProduct?.id) return
    deleteMutation.mutate({ id: deletingProduct.id })
  }

  const handleEdit = (product: ProductDto) => {
    router.push(`/admin/products/${product.id}/edit`)
  }

  const handleDeleteClick = (product: ProductDto) => {
    setDeletingProduct(product)
  }

  const handleAddNew = () => {
    router.push("/admin/products/create")
  }

  const handleCloseDeleteDialog = () => {
    setDeletingProduct(null)
  }

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id)
    toast.success("ID copied to clipboard")
  }

  const columns: ColumnDef<ProductDto>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        const id = row.getValue<string>("id")
        return (
          <Hint label="ID'yi Kopyala">
            <Badge variant="outline" className="font-mono text-xs cursor-pointer" onClick={() => handleCopyId(id)}>
              <Copy className="h-3 w-3 mr-1" />
              {id.slice(0, 8)}...
            </Badge>
          </Hint>
        )
      }
    },
    {
      accessorKey: "name",
      header: "Product Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "categoryName",
      header: "Category",
      cell: ({ row }) => {
        const categoryName = row.getValue<string>("categoryName")
        return categoryName ? (
          <Badge variant="secondary">{categoryName}</Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = row.getValue<number>("price")
        return <div className="font-medium">₺{price?.toLocaleString('tr-TR')}</div>
      },
    },
    {
      accessorKey: "stockQuantity",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.getValue<number>("stockQuantity")
        const stockStatus = {
          low: "warning" as const,
          medium: "default" as const,
          high: "success" as const,
        }

        const getStockLevel = (quantity: number): keyof typeof stockStatus => {
          if (quantity <= 10) return "low"
          if (quantity <= 50) return "medium"
          return "high"
        }

        const stockLevel = getStockLevel(stock || 0)

        return (
          <Badge variant={stockStatus[stockLevel]}>
            {stock || 0} 
          </Badge>
        )
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue<boolean>("isActive")
        return (  
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original
        
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(product)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteClick(product)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  let products: ProductDto[] = []
  let totalRecords = 0
  let totalPages = 1

  if (productsResponse?.data) {
    if ('value' in productsResponse.data && Array.isArray(productsResponse.data.value)) {
      products = productsResponse.data.value || []
      totalRecords = productsResponse.data.pagedInfo?.totalRecords || 0
      totalPages = productsResponse.data.pagedInfo?.totalPages || 1
    } else if (Array.isArray(productsResponse.data)) {
      products = productsResponse.data
      totalRecords = products.length
      totalPages = Math.ceil(totalRecords / pageSize)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-6 w-6" />
            Products
          </h2>
          <p className="text-muted-foreground">
            Product management and stock control
          </p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          New Product
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        page={currentPage}
        pageSize={pageSize}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        isLoading={isLoading || isFetching}
      />

      <ConfirmDialog
        isOpen={!!deletingProduct}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Product"
        description={`Are you sure you want to delete the product "${deletingProduct?.name}"? This action cannot be undone.`}
        isPending={deleteMutation.isPending}
      />
    </div>
  )
} 