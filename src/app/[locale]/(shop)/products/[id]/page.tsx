import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getApiV1ProductId } from "@/api/generated/product/product";
import { ProductDetailsClient } from "@/components/product/product-details-client";
import { ProductBreadcrumb } from "@/components/product/product-breadcrumb";
import { getI18n } from "@/i18n/server";

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
  const t = await getI18n();

  const response = await getApiV1ProductId(id);
  const product = response.data;

  if (!product) {
    return {
      title: t("products.detail.notFound.title"),
      description: t("products.detail.notFound.description"),
    };
  }

  return {
    title: `${product.name} ${t("products.detail.metadata.titleSuffix")}`,
    description:
      product.description || `${product.name} ${t("products.detail.metadata.defaultDescription")}`,
    keywords: [
      product.name,
      product.categoryName,
      ...t("products.detail.metadata.keywords").split(", "),
    ].filter(Boolean) as string[],
  };
}
