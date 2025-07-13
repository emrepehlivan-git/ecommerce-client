import { getApiV1Role } from "@/api/generated/role/role"
import { RolesPageClient } from "@/components/admin/roles/roles-page-client"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Suspense } from "react"
import { auth } from "@/lib/auth"

interface RolesPageProps {
  searchParams: {
    page?: string;
    pageSize?: string;
    search?: string;
  }
}
export default async function RolesPage({ searchParams }: RolesPageProps) {
  const page = Number(searchParams?.page ?? 1);
  const pageSize = Number(searchParams?.pageSize ?? 10);
  const response = await getApiV1Role({
    Page: page,
    PageSize: pageSize,
    Search: searchParams?.search as string,
  });
  const session = await auth();
  console.log("session", session);

  return (
    <Suspense fallback={<RolesPageSkeleton />}>
      <RolesPageClient roles={response.value ?? []} pagedInfo={response.pagedInfo ?? { totalPages: 1, totalRecords: 0 }} />
    </Suspense>
  )
} 

const RolesPageSkeleton = () => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
      <TableBody>
        {Array.from({ length: 5 }, (_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </div>
  )
}