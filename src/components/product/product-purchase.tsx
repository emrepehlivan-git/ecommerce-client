"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { QuantitySelector } from "./quantity-selector";
import { useErrorHandler } from "@/lib/hooks/useErrorHandler";
import { useI18n } from "@/i18n/client";
import { useAppStore } from "@/stores/useAppStore";
import { toast } from "sonner";

interface ProductPurchaseProps {
  productId: string;
  price: number;
  stockQuantity: number;
}

export function ProductPurchase({ productId, price, stockQuantity }: ProductPurchaseProps) {
  const t = useI18n();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useAppStore();
  const { handleError } = useErrorHandler({
    context: "ProductPurchase",
  });

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await addToCart(productId, quantity);
    } catch (error) {
      handleError(error, t("products.purchase.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">{t("products.purchase.quantity")}</span>
          <QuantitySelector
            quantity={quantity}
            onQuantityChange={setQuantity}
            max={stockQuantity}
          />
        </div>

        <div className="flex items-center justify-between text-lg font-semibold">
          <span>{t("products.purchase.total")}</span>
          <span className="text-primary">₺{(price * quantity).toLocaleString("tr-TR")}</span>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="w-full h-12 text-lg"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {isLoading ? t("products.purchase.adding") : t("products.purchase.addToCart")}
        </Button>
      </CardContent>
    </Card>
  );
}
