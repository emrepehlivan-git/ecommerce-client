import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, MoreHorizontal } from "lucide-react"
import type { CategoryDto } from "@/api/generated/model"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CopyButton } from "@/components/ui/copy-button"

export function getCategoryColumns({ handleEdit, handleDeleteClick, handleCopyId }: {
  handleEdit: (category: CategoryDto) => void,
  handleDeleteClick: (category: CategoryDto) => void,
  handleCopyId: (id: string) => void,
}): ColumnDef<CategoryDto>[] {
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
      header: "Category Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const category = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleEdit(category)}>
                <Edit className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteClick(category)} variant="destructive">
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