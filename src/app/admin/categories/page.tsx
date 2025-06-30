import { Suspense } from "react"
import { Metadata } from "next"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { CategoryPageClient } from "@/components/admin/categories-page-client"

export const metadata: Metadata = {
  title: "Categories",
  description: "Category management",
}

export default function CategoriesPage() {
  return (
      <Suspense
        fallback={
          <CategoryPageSkeleton />
        }
      >
        <CategoryPageClient />
      </Suspense>
  )
} 

const CategoryPageSkeleton = () => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}