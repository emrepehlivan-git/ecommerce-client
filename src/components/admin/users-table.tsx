"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { DataTable } from '@/components/ui/data-table'
import { UserDto } from '@/api/generated/model/userDto'
import { ColumnDef } from '@tanstack/react-table'
import { useState, useEffect } from 'react'
import { useDebounce } from '@/hooks/use-debounce'

interface UsersTableProps {
  columns: ColumnDef<UserDto>[]
  data: UserDto[]
  pagedInfo: {
    pageNumber: number
    pageSize: number
    totalPages: number
    totalRecords: number
  }
}

export function UsersTable({ columns, data, pagedInfo }: UsersTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [globalFilter, setGlobalFilter] = useState(searchParams.get("search") ?? "")
  const debouncedFilter = useDebounce(globalFilter)
  const [isSearching, setIsSearching] = useState(false)

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(newPage))
    router.push(`?${params.toString()}`)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('pageSize', String(newPageSize))
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  useEffect(() => {
    const currentSearch = searchParams.get("search") ?? ""
    if (debouncedFilter !== currentSearch) {
      setIsSearching(true)
      const params = new URLSearchParams(searchParams.toString())
      params.set("search", debouncedFilter)
      params.set("page", "1")
      router.push(`?${params.toString()}`)
    }
  }, [debouncedFilter, router, searchParams])

  useEffect(() => {
    const currentSearchInUrl = searchParams.get("search") ?? ""
    if (currentSearchInUrl !== globalFilter) {
      setGlobalFilter(currentSearchInUrl)
    }
    setIsSearching(false)
  }, [searchParams])

  const handleFilterChange = (value: string) => {
    setGlobalFilter(value)
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      page={pagedInfo.pageNumber}
      pageSize={pagedInfo.pageSize}
      totalPages={pagedInfo.totalPages}
      totalRecords={pagedInfo.totalRecords}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      globalFilter={globalFilter}
      onGlobalFilterChange={handleFilterChange}
      isLoading={isSearching}
    />
  )
} 