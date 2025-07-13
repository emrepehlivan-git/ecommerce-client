"use client"

import { columns } from "@/components/admin/roles/roles-table-columns"
import { RolesTable } from "@/components/admin/roles/roles-table"
import { useState } from "react"
import { RoleFormModal } from "@/components/admin/roles/role-form-modal"
import { Button } from "@/components/ui/button"
import { PagedInfo, RoleDto } from "@/api/generated/model"

export function RolesPageClient({ roles, pagedInfo }: { roles: RoleDto[], pagedInfo: PagedInfo }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <RoleFormModal
        role={null}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Roles</h1>
          <Button onClick={() => setIsModalOpen(true)}>Create Role</Button>
        </div>
        <RolesTable columns={columns} roles={roles} pagedInfo={pagedInfo} isLoading={false} />
      </div>
    </>
  )
} 