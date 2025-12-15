"use client"

import { useEffect, useState, useMemo } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { UserDto, RoleDto } from "@/api/generated/model"
import { 
  useGetApiV1Role, 
  useGetApiV1RoleUserUserId,
  usePostApiV1RoleUserUserIdAddRole,
  usePostApiV1RoleUserUserIdRemoveRole,
  getGetApiV1RoleUserUserIdQueryKey
} from "@/api/generated/role/role"
import { getGetApiV1UsersQueryKey } from "@/api/generated/users/users"
import { Search, User, Shield, AlertTriangle } from "lucide-react"
import { useI18n } from "@/i18n/client"
import { useErrorHandler } from "@/hooks/use-error-handling"

interface UserRoleModalProps {
  user: UserDto | null
  isOpen: boolean
  onClose: () => void
}

export function UserRoleModal({ user, isOpen, onClose }: UserRoleModalProps) {
  const t = useI18n()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([])
  const [initialRoleIds, setInitialRoleIds] = useState<string[]>([])
  const queryClient = useQueryClient()
  const { handleError } = useErrorHandler()

  const { data: rolesData, isLoading: rolesLoading } = useGetApiV1Role({
    PageSize: 100
  })

  const { data: userRolesData, isLoading: userRolesLoading } = useGetApiV1RoleUserUserId(
    user?.id || "",
    {
      query: {
        enabled: !!user?.id && isOpen
      }
    }
  )

  const availableRoles = useMemo(() => rolesData?.value || [], [rolesData?.value]);

  const addRoleMutation = usePostApiV1RoleUserUserIdAddRole({
    mutation: {
      onSuccess: () => {
        toast.success(t("admin.users.roleModal.roleAssignedSuccess"))
        queryClient.invalidateQueries({ queryKey: getGetApiV1RoleUserUserIdQueryKey(user?.id || "") })
        queryClient.invalidateQueries({ queryKey: getGetApiV1UsersQueryKey() })
      },
      onError: (error: any) => {
        handleError(error)
      }
    }
  })

  const removeRoleMutation = usePostApiV1RoleUserUserIdRemoveRole({
    mutation: {
      onSuccess: () => {
        toast.success(t("admin.users.roleModal.roleRemovedSuccess"))
        queryClient.invalidateQueries({ queryKey: getGetApiV1RoleUserUserIdQueryKey(user?.id || "") })
        queryClient.invalidateQueries({ queryKey: getGetApiV1UsersQueryKey() })
      },
      onError: (error: any) => {
        handleError(error)
      }
    }
  })

  useEffect(() => {
    if (userRolesData?.roles && availableRoles.length > 0) {
      const currentRoleNames = userRolesData.roles.filter((role: string) => role) as string[]
      const currentRoleIds = availableRoles
        .filter((role: RoleDto) => currentRoleNames.includes(role.name || ""))
        .map((role: RoleDto) => role.id)
        .filter(Boolean) as string[]
      
      setSelectedRoleIds(currentRoleIds)
      setInitialRoleIds(currentRoleIds)
    }
  }, [userRolesData, availableRoles])

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("")
      setSelectedRoleIds([])
      setInitialRoleIds([])
    }
  }, [isOpen])

  const filteredRoles = availableRoles.filter((role: RoleDto) => 
    role.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRoleToggle = (roleId: string, isChecked: boolean) => {
    const role = availableRoles.find((r: RoleDto) => r.id === roleId)
    if (role?.name === "Customer") {
      return
    }
    
    if (isChecked) {
      setSelectedRoleIds(prev => [...prev, roleId])
    } else {
      setSelectedRoleIds(prev => prev.filter(id => id !== roleId))
    }
  }

  const handleSave = async () => {
    if (!user?.id) {
      handleError(new Error("User ID is missing"))
      return;
    }

    const rolesToAdd = selectedRoleIds.filter(roleId => !initialRoleIds.includes(roleId))
    const rolesToRemove = initialRoleIds.filter(roleId => !selectedRoleIds.includes(roleId))

    const protectedRoleIds = availableRoles
      .filter((role: RoleDto) => role.name === "Customer")
      .map((role: RoleDto) => role.id)
      .filter(Boolean) as string[]

    const safeRolesToRemove = rolesToRemove.filter(roleId => !protectedRoleIds.includes(roleId))

    try {
      for (const roleId of rolesToAdd) {
        await addRoleMutation.mutateAsync({
          userId: user.id,
          data: { roleId }
        })
      }

      for (const roleId of safeRolesToRemove) {
        await removeRoleMutation.mutateAsync({
          userId: user.id,
          data: { roleId }
        })
      }

      onClose()
    } catch (error) {
      handleError(error)
    }
  }

  const hasChanges = () => {
    return JSON.stringify(selectedRoleIds.sort()) !== JSON.stringify(initialRoleIds.sort())
  }

  const isLoading = addRoleMutation.isPending || removeRoleMutation.isPending

  const currentRoleNames = availableRoles
    .filter((role: RoleDto) => selectedRoleIds.includes(role.id || ""))
    .map((role: RoleDto) => role.name)
    .filter((name): name is string => Boolean(name))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t("admin.users.roleModal.title")}
          </DialogTitle>
          <DialogDescription>
            {t("admin.users.roleModal.description", { 
              fullName: user?.fullName || "", 
              email: user?.email || "" 
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("admin.users.roleModal.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {userRolesLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t("admin.users.roleModal.currentRoles")}</Label>
              <div className="flex flex-wrap gap-2">
                {currentRoleNames.length > 0 ? (
                  currentRoleNames.map((roleName: string) => (
                    <Badge key={roleName} variant="secondary" className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {roleName}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">{t("admin.users.roleModal.noRolesAssigned")}</span>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-medium">{t("admin.users.roleModal.availableRoles")}</Label>
            <ScrollArea className="h-[200px] border rounded-md p-3">
              {rolesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              ) : filteredRoles.length > 0 ? (
                <div className="space-y-3">
                  {filteredRoles.map((role: RoleDto) => {
                    const isProtected = role.name === "Customer"
                    const isSelected = selectedRoleIds.includes(role.id || "")
                    
                    return (
                      <div key={role.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={role.id}
                          checked={isSelected}
                          onCheckedChange={(checked) => 
                            handleRoleToggle(role.id || "", checked as boolean)
                          }
                          disabled={isLoading || isProtected}
                        />
                        <Label 
                          htmlFor={role.id} 
                          className={`text-sm font-normal cursor-pointer flex-1 ${
                            isProtected ? 'opacity-60 cursor-not-allowed' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{role.name}</span>
                            {isProtected && (
                              <Badge variant="outline" className="ml-2">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {t("admin.users.roleModal.protectedBadge")}
                              </Badge>
                            )}
                          </div>
                          {isProtected && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {t("admin.users.roleModal.protectedRoleMessage")}
                            </p>
                          )}
                        </Label>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{t("admin.users.roleModal.noRolesFound")}</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {t("admin.users.roleModal.cancelButton")}
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges() || isLoading}
            className="min-w-[100px]"
          >
            {isLoading ? t("admin.users.roleModal.savingButton") : t("admin.users.roleModal.saveButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}