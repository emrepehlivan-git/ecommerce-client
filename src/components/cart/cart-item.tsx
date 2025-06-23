"use client";

import Image from "next/image";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItemDto } from "@/api/generated/model";
import { useCart } from "@/contexts/cart-context";
import { useErrorHandler } from "@/lib/hooks/useErrorHandler";

interface CartItemProps {
  item: CartItemDto;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const { handleError } = useErrorHandler({
    context: 'CartItem'
  });

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsLoading(true);
    try {
      await updateQuantity(item.productId!, newQuantity);
    } catch (error) {
      handleError(error, 'Miktar güncellenirken hata oluştu!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      await removeFromCart(item.productId!);
    } catch (error) {
      handleError(error, 'Ürün sepetten çıkarılırken hata oluştu!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Product Image */}
          <div className="relative w-full md:w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src="/images/not-found-product.webp"
              alt={item.productName || "Ürün"}
              fill
              className="object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
              {item.productName}
            </h3>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="text-sm">
                  Birim Fiyat: ₺{item.unitPrice?.toLocaleString('tr-TR')}
                </Badge>
                
                {/* Quantity Controls */}
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange((item.quantity || 1) - 1)}
                    disabled={isLoading || (item.quantity || 1) <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <span className="px-4 py-2 text-center min-w-[50px] font-medium">
                    {item.quantity}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange((item.quantity || 1) + 1)}
                    disabled={isLoading}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">
                    ₺{item.totalPrice?.toLocaleString('tr-TR')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} x ₺{item.unitPrice?.toLocaleString('tr-TR')}
                  </p>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemove}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 