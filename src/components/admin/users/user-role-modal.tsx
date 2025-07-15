"use client"

import { useEffect, useState } from "react"
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
  usePostApiV1RoleUserUserIdRemoveRole 
} from "@/api/generated/role/role"
import { Search, User, Shield, AlertTriangle } from "lucide-react"

interface UserRoleModalProps {
  user: UserDto | null
  isOpen: boolean
  onClose: () => void
}

export function UserRoleModal({ user, isOpen, onClose }: UserRoleModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [initialRoles, setInitialRoles] = useState<string[]>([])
  const queryClient = useQueryClient()

  // Fetch all available roles
  const { data: rolesData, isLoading: rolesLoading } = useGetApiV1Role({
    pageSize: 100,
    search: searchTerm
  })

  // Fetch user's current roles
  const { data: userRolesData, isLoading: userRolesLoading } = useGetApiV1RoleUserUserId(
    user?.id || "",
    {
      query: {
        enabled: !!user?.id && isOpen
      }
    }
  )

  // Mutations for role assignment
  const addRoleMutation = usePostApiV1RoleUserUserIdAddRole({
    mutation: {
      onSuccess: () => {
        toast.success("Role assigned successfully")
        queryClient.invalidateQueries({ queryKey: ["/api/v1/Role/user"] })
        queryClient.invalidateQueries({ queryKey: ["/api/v1/Users"] })
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.detail || "Failed to assign role")
      }
    }
  })

  const removeRoleMutation = usePostApiV1RoleUserUserIdRemoveRole({
    mutation: {
      onSuccess: () => {
        toast.success("Role removed successfully")
        queryClient.invalidateQueries({ queryKey: ["/api/v1/Role/user"] })
        queryClient.invalidateQueries({ queryKey: ["/api/v1/Users"] })
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.detail || "Failed to remove role")
      }
    }
  })

  // Initialize selected roles when user roles data is loaded
  useEffect(() => {
    if (userRolesData?.roles) {
      const currentRoles = userRolesData.roles.filter(role => role) as string[]
      setSelectedRoles(currentRoles)
      setInitialRoles(currentRoles)
    }
  }, [userRolesData])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("")
      setSelectedRoles([])
      setInitialRoles([])
    }
  }, [isOpen])

  const availableRoles = rolesData?.data || []
  const filteredRoles = availableRoles.filter(role => 
    role.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRoleToggle = (roleId: string, roleName: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedRoles(prev => [...prev, roleName])
    } else {
      setSelectedRoles(prev => prev.filter(r => r !== roleName))
    }
  }

  const handleSave = async () => {
    if (!user?.id) return

    const rolesToAdd = selectedRoles.filter(role => !initialRoles.includes(role))
    const rolesToRemove = initialRoles.filter(role => !selectedRoles.includes(role))

    // Find role IDs for the roles to add/remove
    const roleMap = new Map(availableRoles.map(role => [role.name, role.id]))

    try {
      // Add new roles
      for (const roleName of rolesToAdd) {
        const roleId = roleMap.get(roleName)
        if (roleId) {
          await addRoleMutation.mutateAsync({
            userId: user.id,
            data: { roleId }
          })
        }
      }

      // Remove old roles
      for (const roleName of rolesToRemove) {
        const roleId = roleMap.get(roleName)
        if (roleId) {
          await removeRoleMutation.mutateAsync({
            userId: user.id,
            data: { roleId }
          })
        }
      }

      onClose()
    } catch (error) {
      // Individual errors are handled in the mutation callbacks
      console.error("Error updating user roles:", error)
    }
  }

  const hasChanges = () => {
    return JSON.stringify(selectedRoles.sort()) !== JSON.stringify(initialRoles.sort())
  }

  const isLoading = addRoleMutation.isPending || removeRoleMutation.isPending

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Manage User Roles
          </DialogTitle>
          <DialogDescription>
            Assign or remove roles for <strong>{user?.fullName}</strong> ({user?.email})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Current Roles */}
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
              <Label className="text-sm font-medium">Current Roles</Label>
              <div className="flex flex-wrap gap-2">
                {selectedRoles.length > 0 ? (
                  selectedRoles.map(role => (
                    <Badge key={role} variant="secondary" className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {role}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No roles assigned</span>
                )}
              </div>
            </div>
          )}

          {/* Available Roles */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Available Roles</Label>
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
                  {filteredRoles.map(role => (
                    <div key={role.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={role.id}
                        checked={selectedRoles.includes(role.name || "")}
                        onCheckedChange={(checked) => 
                          handleRoleToggle(role.id || "", role.name || "", checked as boolean)
                        }
                        disabled={isLoading}
                      />
                      <Label 
                        htmlFor={role.id} 
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        <div className="flex items-center justify-between">
                          <span>{role.name}</span>
                          {role.name === "Customer" && (
                            <Badge variant="outline" className="ml-2">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Protected
                            </Badge>
                          )}
                        </div>
                        {role.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {role.description}
                          </p>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No roles found</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges() || isLoading}
            className="min-w-[100px]"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}