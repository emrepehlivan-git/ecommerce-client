import { useSession } from "next-auth/react";
import { useGetApiV1UsersPermissions } from "@/api/generated/users/users";

export const usePermissions = () => {
  const { status } = useSession();
  const { data: permissionsResponse, isLoading } = useGetApiV1UsersPermissions({
    query: {
      enabled: status === "authenticated",
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  });

  return {
    permissions: permissionsResponse?.data ?? [],
    isLoading,
  };
};

export const useHasPermission = (permission: string) => {
  const { permissions, isLoading } = usePermissions();
  
  return {
    hasPermission: permissions.includes(permission),
    isLoading,
  };
};

export const useHasAllPermissions = (permissions: string[]) => {
  const { permissions: userPermissions, isLoading } = usePermissions();
  
  return {
    hasPermissions: permissions.every(p => userPermissions.includes(p)),
    isLoading,
  };
};

export const useHasAnyPermission = (permissions: string[]) => {
  const { permissions: userPermissions, isLoading } = usePermissions();
  
  return {
    hasPermission: permissions.some(p => userPermissions.includes(p)),
    isLoading,
  };
}; 