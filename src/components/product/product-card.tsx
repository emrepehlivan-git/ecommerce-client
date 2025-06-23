import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductDto } from "@/api/generated/model";
import { QuickAddToCart } from "@/components/cart/quick-add-to-cart";
import Link from "next/link";

interface ProductCardProps {
  product: ProductDto;
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = !product.isActive || (product.stockQuantity || 0) === 0;
  
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <Image
            src="/images/not-found-product.webp"
            alt={product.name || "Ürün"}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary">Stokta Yok</Badge>
            </div>
          )}
          
          {/* Quick Add to Cart - Sadece stokta varsa göster */}
          {!isOutOfStock && (
            <QuickAddToCart 
              productId={product.id || ""}
              productName={product.name || "Ürün"}
              variant="icon"
            />
          )}
        </div>
        
        <CardContent className="p-4 space-y-2">
          <div className="space-y-1">
            <h3 className="font-medium text-sm line-clamp-2 text-gray-900">
              {product.name}
            </h3>
            
            {product.categoryName && (
              <Badge variant="outline" className="text-xs">
                {product.categoryName}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              ₺{product.price?.toLocaleString('tr-TR')}
            </span>
            
            {product.stockQuantity !== undefined && (
              <span className="text-xs text-gray-500">
                {product.stockQuantity > 0 
                  ? `${product.stockQuantity} adet` 
                  : "Stokta yok"
                }
              </span>
            )}
          </div>
          
          {product.description && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {product.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
} 