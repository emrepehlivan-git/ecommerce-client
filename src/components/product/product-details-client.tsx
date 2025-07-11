"use client";

import { useI18n } from "@/i18n/client";
import { ProductDto } from "@/api/generated/model";
import { ProductImageGallery } from "./product-image-gallery";
import { ProductInfo } from "./product-info";
import { ProductActions } from "./product-actions";
import { ProductStockInfo } from "./product-stock-info";
import { ProductDescription } from "./product-description";
import { ProductPurchase } from "./product-purchase";
import { OutOfStockNotice } from "./out-of-stock-notice";
import { Separator } from "../ui/separator";

interface ProductDetailsClientProps {
  product: ProductDto;
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const t = useI18n();
  const isOutOfStock = !product.isActive || (product.stockQuantity || 0) === 0;
  const defaultProductName = t("products.detail.defaultName");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <ProductImageGallery
        productName={product.name || defaultProductName}
        isOutOfStock={isOutOfStock}
        images={product.images}
      />

      <div className="space-y-6">
        <ProductInfo
          name={product.name || defaultProductName}
          price={product.price || 0}
          categoryName={product.categoryName || undefined}
          actions={
            <ProductActions
              productName={product.name || defaultProductName}
              productDescription={product.description || undefined}
            />
          }
        />

        <Separator />

        <ProductStockInfo
          stockQuantity={product.stockQuantity || 0}
          isActive={product.isActive || false}
        />

        <Separator />

        <ProductDescription description={product.description || ""} />

        <Separator />

        {!isOutOfStock ? (
          <ProductPurchase
            productId={product.id || ""}
            price={product.price || 0}
            stockQuantity={product.stockQuantity || 0}
          />
        ) : (
          <OutOfStockNotice />
        )}
      </div>
    </div>
  );
}
