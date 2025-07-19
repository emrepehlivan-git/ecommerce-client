import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Package } from "lucide-react";
import type { ProductDto } from "@/api/generated/model";
import { CopyButton } from "@/components/ui/copy-button";

export function getStockColumns({
  handleStockUpdate,
}: {
  handleStockUpdate: (product: ProductDto) => void;
}): ColumnDef<ProductDto>[] {
  return [
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
      header: "Product Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <div className="font-medium">{row.getValue("name")}</div>
        </div>
      ),
    },
    {
      accessorKey: "categoryName",
      header: "Category",
      cell: ({ row }) => {
        const categoryName = row.getValue<string>("categoryName");
        return categoryName ? (
          <Badge variant="secondary">{categoryName}</Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: "stockQuantity",
      header: "Current Stock",
      cell: ({ row }) => {
        const stock = row.getValue<number>("stockQuantity") || 0;
        
        const getStockVariant = (quantity: number) => {
          if (quantity === 0) return "destructive";
          if (quantity <= 10) return "warning";
          return "success";
        };

        const getStockLabel = (quantity: number) => {
          if (quantity === 0) return "Out of Stock";
          if (quantity <= 10) return "Low Stock";
          return "In Stock";
        };

        return (
          <div className="flex flex-col gap-1">
            <div className="font-medium text-lg">{stock}</div>
            <Badge variant={getStockVariant(stock)} className="text-xs">
              {getStockLabel(stock)}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Unit Price",
      cell: ({ row }) => {
        const price = row.getValue<number>("price");
        return <div className="font-medium">₺{price?.toLocaleString("tr-TR")}</div>;
      },
    },
    {
      header: "Stock Value",
      cell: ({ row }) => {
        const stock = row.getValue<number>("stockQuantity") || 0;
        const price = row.original.price || 0;
        const value = stock * price;
        return <div className="font-medium">₺{value.toLocaleString("tr-TR")}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const product = row.original;

        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStockUpdate(product)}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Update Stock
          </Button>
        );
      },
    },
  ];
}