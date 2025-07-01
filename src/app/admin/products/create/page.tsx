import { Metadata } from "next"
import { Suspense } from "react"
import { getApiCategory } from "@/api/generated/category/category"
import { ProductCreateClient } from "@/components/admin/products/product-create-client"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Create Product",
  description: "Product create page",
}

function ProductCreateSkeleton() {
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

export default async function ProductCreatePage() {
  const categoriesResponse = await getApiCategory({})
  
  let categories = []
  if (categoriesResponse?.data) {
    if ('value' in categoriesResponse.data && Array.isArray(categoriesResponse.data.value)) {
      categories = categoriesResponse.data.value || []
    } else if (Array.isArray(categoriesResponse.data)) {
      categories = categoriesResponse.data
    }
  }

  return (
    <Suspense fallback={<ProductCreateSkeleton />}>
      <ProductCreateClient categories={categories} />
    </Suspense>
  )
} 