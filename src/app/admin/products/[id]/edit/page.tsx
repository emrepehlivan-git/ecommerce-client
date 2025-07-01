import { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getApiCategory } from "@/api/generated/category/category"
import { getApiProductId } from "@/api/generated/product/product"
import { ProductEditClient } from "@/components/admin/product-edit-client"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Edit Product",
  description: "Product edit page",
}

interface ProductEditPageProps {
  params: {
    id: string
  }
}

function ProductEditSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-20 w-full" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  )
}

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  const { id } = await params
  
  try {
    const [categoriesResponse, productResponse] = await Promise.all([
      getApiCategory({}),
      getApiProductId(id)
    ])
    
    let categories = []
    if (categoriesResponse?.data) {
      if ('value' in categoriesResponse.data && Array.isArray(categoriesResponse.data.value)) {
        categories = categoriesResponse.data.value || []
      } else if (Array.isArray(categoriesResponse.data)) {
        categories = categoriesResponse.data
      }
    }

    const product = productResponse?.data
    if (!product) {
      notFound()
    }

    return (
      <Suspense fallback={<ProductEditSkeleton />}>
        <ProductEditClient categories={categories} product={product} />
      </Suspense>
    )
  } catch (error) {
    notFound()
  }
} 