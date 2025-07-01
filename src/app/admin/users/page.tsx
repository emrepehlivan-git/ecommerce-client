import { getApiUsers } from '@/api/generated/users/users'
import { userColumns } from '@/components/admin/users/users-table-columns'
import { UsersTable } from '@/components/admin/users/users-table'

interface UsersPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const page = Number(searchParams?.page ?? 1)
  const pageSize = Number(searchParams?.pageSize ?? 10)
  const response = await getApiUsers({ Page: page, PageSize: pageSize, Search: searchParams?.search as string })

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <UsersTable
        columns={userColumns}
        data={response.data.value}
        pagedInfo={response.data.pagedInfo}
      />
    </div>
  )
} 