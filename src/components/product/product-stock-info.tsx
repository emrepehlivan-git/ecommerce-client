"use client";

import { useI18n } from "@/i18n/client";
import { Badge } from "@/components/ui/badge";

interface ProductStockInfoProps {
  stockQuantity: number;
  isActive: boolean;
}

export function ProductStockInfo({ stockQuantity, isActive }: ProductStockInfoProps) {
  const t = useI18n();
  const isOutOfStock = !isActive || stockQuantity === 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{t("products.stock.status")}</span>
        <Badge variant={isOutOfStock ? "destructive" : "default"}>
          {isOutOfStock
            ? t("products.stock.outOfStock")
            : t("products.stock.inStock", { count: stockQuantity })}
        </Badge>
      </div>
    </div>
  );
}
