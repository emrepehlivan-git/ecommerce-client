"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { QuantitySelector } from "./quantity-selector";
import { useCart } from "@/contexts/cart-context";
import { useErrorHandler } from "@/lib/hooks/useErrorHandler";

interface ProductPurchaseProps {
  productId: string;
  price: number;
  stockQuantity: number;
}

export function ProductPurchase({ productId, price, stockQuantity }: ProductPurchaseProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();
  const { handleError } = useErrorHandler({
    context: "ProductPurchase",
  });

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await addToCart(productId, quantity);
    } catch (error) {
      handleError(error, "Ürün sepete eklenirken hata oluştu!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Miktar:</span>
          <QuantitySelector
            quantity={quantity}
            onQuantityChange={setQuantity}
            max={stockQuantity}
          />
        </div>

        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Toplam:</span>
          <span className="text-primary">₺{(price * quantity).toLocaleString("tr-TR")}</span>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="w-full h-12 text-lg"
          size="lg"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {isLoading ? "Ekleniyor..." : "Sepete Ekle"}
        </Button>
      </CardContent>
    </Card>
  );
}
