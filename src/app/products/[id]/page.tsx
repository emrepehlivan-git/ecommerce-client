import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getApiProductId } from "@/api/generated/product/product";
import { ProductDetailsClient } from "@/components/product/product-details-client";
import { ProductBreadcrumb } from "@/components/product/product-breadcrumb";

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

        const response = await getApiProductId(id);
    const product = response.data;

    if (!product) {
      notFound();
    }

    return (
      <div className="container mx-auto px-4 py-6">
        <ProductBreadcrumb product={product} />
        <ProductDetailsClient product={product} />
      </div>
    );
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await getApiProductId(id);
    const product = response.data;

    if (!product) {
      return {
        title: "Ürün Bulunamadı",
        description: "Aradığınız ürün bulunamadı."
      };
    }

    return {
      title: `${product.name} | E-Ticaret`,
      description: product.description || `${product.name} ürününü inceleyin ve satın alın.`,
      keywords: [product.name, product.categoryName, "e-ticaret", "online alışveriş"].filter(Boolean),
    };
  } catch (error) {
    return {
      title: "Ürün Bulunamadı",
      description: "Aradığınız ürün bulunamadı."
    };
  }
} 