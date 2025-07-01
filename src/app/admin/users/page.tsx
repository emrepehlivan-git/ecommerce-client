import { getApiUsers } from '@/api/generated/users/users'
import { userColumns } from '@/components/admin/users/users-table-columns'
import { UsersTable } from '@/components/admin/users/users-table'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Suspense } from 'react'

interface UsersPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const page = Number(searchParams?.page ?? 1)
  const pageSize = Number(searchParams?.pageSize ?? 10)
  const response = await getApiUsers({ Page: page, PageSize: pageSize, Search: searchParams?.search as string })

  return (
    <Suspense fallback={<UsersPageSkeleton />}>
    <div className="p-6">
      <h3 className="text-lg font-bold mb-4">Users</h3>
      <UsersTable
        columns={userColumns}
        data={response.data.value}
        pagedInfo={response.data.pagedInfo}
      />
    </div>
    </Suspense>
  )
} 


const UsersPageSkeleton = () => {
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