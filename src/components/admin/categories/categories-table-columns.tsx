import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Hint } from "@/components/ui/hint"
import { Edit, Trash2, Copy } from "lucide-react"
import type { CategoryDto } from "@/api/generated/model"

// columns fonksiyonu, gerekli handler fonksiyonlarını parametre olarak alacak
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
          <Hint label="Copy ID">
            <Badge variant="outline" className="font-mono text-xs cursor-pointer" onClick={() => handleCopyId(id)}>
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy ID</span>
              {id}
            </Badge>
          </Hint>
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
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(category)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteClick(category)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]
} 