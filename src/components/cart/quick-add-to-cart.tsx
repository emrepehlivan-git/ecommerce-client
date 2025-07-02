"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { useErrorHandler } from "@/lib/hooks/useErrorHandler";
import { toast } from "sonner";

interface QuickAddToCartProps {
  productId: string;
  variant?: "default" | "icon";
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function QuickAddToCart({
  productId,
  variant = "default",
  size = "default",
  className,
}: QuickAddToCartProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useAppStore();
  const { handleError } = useErrorHandler({
    context: "QuickAddToCart",
  });

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if used in Link
    e.stopPropagation();

    setIsLoading(true);
    try {
      await addToCart(productId, 1);
    } catch (error) {
      handleError(error, "Ürün sepete eklenirken hata oluştu!");
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "icon") {
    return (
      <Button
        onClick={handleAddToCart}
        disabled={isLoading}
        size="icon"
        variant="secondary"
        className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity ${className}`}
      >
        {isLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isLoading}
      size={size}
      className={`w-full ${className}`}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      {isLoading ? "Adding to cart..." : "Add to cart"}
    </Button>
  );
}
