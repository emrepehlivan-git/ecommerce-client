import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getApiV1ProductId } from "@/api/generated/product/product";
import { ProductDetailsClient } from "@/components/product/product-details-client";
import { ProductBreadcrumb } from "@/components/product/product-breadcrumb";

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  const response = await getApiV1ProductId(id);
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

  const response = await getApiV1ProductId(id);
  const product = response.data;

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for was not found.",
    };
  }

  return {
    title: `${product.name} | E-Ticaret`,
    description: product.description || `${product.name} product details.`,
    keywords: [product.name, product.categoryName, "e-commerce", "online shopping"].filter(Boolean),
  };
}
