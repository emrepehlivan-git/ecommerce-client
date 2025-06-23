import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { ProductDto } from "@/api/generated/model";

interface ProductBreadcrumbProps {
  product: ProductDto;
}

export function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-6">
      <Link 
        href="/" 
        className="hover:text-gray-700 transition-colors flex items-center"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      <ChevronRight className="h-4 w-4" />
      
      <Link 
        href="/products" 
        className="hover:text-gray-700 transition-colors"
      >
        Ürünler
      </Link>
      
      {product.categoryName && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-400">{product.categoryName}</span>
        </>
      )}
      
      <ChevronRight className="h-4 w-4" />
      <span className="text-gray-900 font-medium line-clamp-1">
        {product.name}
      </span>
    </nav>
  );
} 