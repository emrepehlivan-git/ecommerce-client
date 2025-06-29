import { getApiUsers } from '@/api/generated/users/users'
import { UserDto } from '@/api/generated/model/userDto'
import { userColumns } from '@/components/admin/users-table-columns'
import { UsersTable } from '@/components/admin/users-table'

interface UsersPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const page = Number(searchParams?.page ?? 1)
  const pageSize = Number(searchParams?.pageSize ?? 10)
  const response = await getApiUsers({ Page: page, PageSize: pageSize, Search: searchParams?.search as string })
  const users: UserDto[] = response.data.value
  const pagedInfo = response.data.pagedInfo

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <UsersTable
        columns={userColumns}
        data={users}
        pagedInfo={{
          pageNumber: pagedInfo.pageNumber,
          pageSize: pagedInfo.pageSize,
          totalPages: Math.ceil(pagedInfo.totalRecords / pagedInfo.pageSize),
          totalRecords: pagedInfo.totalRecords,
        }}
      />
    </div>
  )
} 