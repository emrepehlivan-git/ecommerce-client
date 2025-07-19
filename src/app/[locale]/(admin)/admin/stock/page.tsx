import { Suspense } from "react"
import { Metadata } from "next"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { StockPageClient } from "@/components/admin/stock/stock-page-client"

export const metadata: Metadata = {
  title: "Stock Management",
  description: "Inventory and stock management",
}

function StockPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: 5 }, (_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }, (_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 5 }, (_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default function StockPage() {
  return (
    <Suspense fallback={<StockPageSkeleton />}>
      <StockPageClient />
    </Suspense>
  )
}