import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
import type { ProductDto } from "@/api/generated/model"
import { CopyButton } from "@/components/ui/copy-button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"


export function getProductColumns({ handleEdit, handleDeleteClick, handleCopyId }: {
  handleEdit: (product: ProductDto) => void,
  handleDeleteClick: (product: ProductDto) => void,
  handleCopyId: (id: string) => void,
}): ColumnDef<ProductDto>[] {
  return [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        const id = row.getValue<string>("id")
        return (
            <div className="flex items-center gap-2">
              <CopyButton value={id} className="h-5 w-5 p-0 mr-1" />
              <span className="font-mono text-xs">{id.slice(0, 8)}</span>
            </div>
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
          high: "outline" as const,
        }

        const getStockLevel = (quantity: number): keyof typeof stockStatus => {
          if (quantity <= 10) return "low"
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
          <Badge variant={isActive ? "success" : "destructive"}>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleEdit(product)}> 
                  <Edit className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteClick(product)} variant="destructive">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> 
        )
      },
    },
  ]
} 