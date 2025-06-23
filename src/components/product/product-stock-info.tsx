import { Badge } from "@/components/ui/badge";

interface ProductStockInfoProps {
  stockQuantity: number;
  isActive: boolean;
}

export function ProductStockInfo({ stockQuantity, isActive }: ProductStockInfoProps) {
  const isOutOfStock = !isActive || stockQuantity === 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Stok Durumu:</span>
        <Badge variant={isOutOfStock ? "destructive" : "default"}>
          {isOutOfStock 
            ? "Stokta Yok" 
            : `${stockQuantity} adet mevcut`
          }
        </Badge>
      </div>
    </div>
  );
} 