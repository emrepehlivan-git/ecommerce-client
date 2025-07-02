"use client";

import { useI18n } from "@/i18n/client";
import { Card, CardContent } from "@/components/ui/card";

export function OutOfStockNotice() {
  const t = useI18n();

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardContent className="p-6 text-center">
        <p className="text-orange-800 font-medium">{t("products.outOfStock.title")}</p>
        <p className="text-orange-600 text-sm mt-1">{t("products.outOfStock.followUp")}</p>
      </CardContent>
    </Card>
  );
}
