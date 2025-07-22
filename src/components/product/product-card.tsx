import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductDto } from "@/api/generated/model";
import Link from "next/link";
import { useI18n } from "@/i18n/client";
import { useState } from "react";

interface ProductCardProps {
  product: ProductDto;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useI18n() ;
  const [isImageLoading, setImageLoading] = useState(true);
  const isOutOfStock = !product.isActive || (product.stockQuantity || 0) === 0;

  const getProductImage = () => {
    const activeImages = product.images?.filter(img => img.isActive);
    if (activeImages && activeImages.length > 0) {
      const primaryImage = activeImages.find(img => img.displayOrder === 1) || activeImages[0];
      return primaryImage.thumbnailUrl || primaryImage.imageUrl || "/images/not-found-product.webp";
    }
    return "/images/not-found-product.webp";
  };

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <Image
            src={getProductImage()}
            alt={product.name || "Ürün"}
            fill
            className={`object-cover transition-all duration-500 group-hover:scale-105 ${
              isImageLoading ? "blur-sm scale-110" : "blur-0 scale-100"
            }`}
            onLoad={() => setImageLoading(false)}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyvcW2YellmjMo3tp5XZOqc2w3DEF2s7FZpMRFhVxDEiZEGI2nD7xUOwMlNhYF+rjD3mNjPdwwcdcyHbJ3+1SqhSUYfcD3RFY4rSb9yEeFVm3BPqNMXw1uXhJktdPPKmEhzKf5yZHmhBLRGK2k6UlBxkSJEsEYnr+Ub0ndGLcjOsB7gtQKajvww3Y6DWQIqlgM86+1BXCPwFhfCXlqfgwVWn0z/2Q=="
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary">{t("products.card.outOfStock")}</Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-2">
          <div className="space-y-1">
            <h3 className="font-medium text-sm line-clamp-2 text-gray-900">{product.name}</h3>

            {product.categoryName && (
              <Badge variant="outline" className="text-xs">
                {product.categoryName}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              ₺{product.price?.toLocaleString("tr-TR")}
            </span>

            {product.stockQuantity !== undefined && (
              <span className="text-xs text-gray-500">
                {product.stockQuantity > 0 ? `${product.stockQuantity} ${t("products.card.inStock")}` : t("products.card.outOfStock")}
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
