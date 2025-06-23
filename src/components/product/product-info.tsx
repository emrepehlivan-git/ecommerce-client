import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

interface ProductInfoProps {
  name: string;
  price: number;
  categoryName?: string;
  actions?: ReactNode;
}

export function ProductInfo({ name, price, categoryName, actions }: ProductInfoProps) {
  return (
    <div className="space-y-2">
      {categoryName && (
        <Badge variant="outline" className="mb-2">
          {categoryName}
        </Badge>
      )}
      
      <h1 className="text-3xl font-bold text-gray-900">
        {name}
      </h1>
      
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold text-primary">
          ₺{price.toLocaleString('tr-TR')}
        </span>
        {actions}
      </div>
    </div>
  );
} 