import type { Session } from "next-auth";
import { auth } from "./auth";
import { getApiV1UsersPermissions } from "@/api/generated/users/users";

/**
 * Kullanıcının belirli bir role sahip olup olmadığını kontrol eder
 */
export async function hasRole(requiredRole: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.role) return false;
  
  return Array.isArray(session.user.role) 
    ? session.user.role.includes(requiredRole)
    : session.user.role === requiredRole;
}

/**
 * Kullanıcının admin rolüne sahip olup olmadığını kontrol eder
 */
export async function isAdmin(): Promise<boolean> {
  return await hasRole("admin");
}

/**
 * Kullanıcının herhangi bir admin rolüne sahip olup olmadığını kontrol eder
 */
export async function hasAdminAccess(): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.role) return false;
  
  const adminRoles = ["admin", "superadmin", "Admin", "SuperAdmin"];
  const userRoles = Array.isArray(session.user.role) ? session.user.role : [session.user.role];
  
  return adminRoles.some(adminRole => 
    userRoles.some(userRole => userRole.toLowerCase() === adminRole.toLowerCase())
  );
}

/**
 * Kullanıcının belirli permission'a sahip olup olmadığını kontrol eder
 */
export async function hasPermission(requiredPermission: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.permissions) return false;
  
  return Array.isArray(session.user.permissions) 
    ? session.user.permissions.includes(requiredPermission)
    : false;
}

/**
 * Client-side role kontrolü için hook benzeri fonksiyon
 */
export function checkUserRole(userRole: string[] | string | undefined, requiredRole: string): boolean {
  if (!userRole) return false;
  
  return Array.isArray(userRole) 
    ? userRole.includes(requiredRole)
    : userRole === requiredRole;
}

/**
 * Client-side admin kontrolü
 */
export function checkAdminAccess(userRole: string[] | string | undefined): boolean {
  if (!userRole) return false;
  
  const adminRoles = ["admin", "superadmin", "Admin", "SuperAdmin"];
  const roles = Array.isArray(userRole) ? userRole : [userRole];
  
  return adminRoles.some(adminRole => 
    roles.some(role => role.toLowerCase() === adminRole.toLowerCase())
  );
}

/**
 * Yetkisiz erişim durumunda yönlendirme
 */
export function redirectUnauthorized(): never {
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
  throw new Error('Unauthorized access');
}

async function getUserPermissions(): Promise<string[]> {
  try {
    const response = await getApiV1UsersPermissions();
    return response.data;
  } catch (error) {
    return [];
  }
}

export const hasAllPermissions = async (
  permissions: string[],
): Promise<boolean> => {
  const session = await auth();
  if (!session) return false;

  const userPermissions = await getUserPermissions();
  return permissions.every((p) => userPermissions.includes(p));
};

export const hasAnyPermission = async (
  permissions: string[],
): Promise<boolean> => {
  const session = await auth();
  if (!session) return false;

  const userPermissions = await getUserPermissions();
  return permissions.some((p) => userPermissions.includes(p));
};

export const getUserInfo = async (accessToken: string) => {
  const issuer = process.env.NEXT_PUBLIC_AUTH_SERVER_URL;
  const normalizedIssuer = issuer?.endsWith("/") ? issuer : `${issuer}/`;

  const getInternalIssuer = () => {
    if (process.env.INTERNAL_AUTH_SERVER_URL) {
      return process.env.INTERNAL_AUTH_SERVER_URL?.endsWith("/")
        ? process.env.INTERNAL_AUTH_SERVER_URL
        : `${process.env.INTERNAL_AUTH_SERVER_URL}/`;
    }
    return normalizedIssuer;
  };
  
  try {
    const userinfoUrl =
      typeof window === "undefined"
        ? `${getInternalIssuer()}connect/userinfo`
        : `${normalizedIssuer}connect/userinfo`;

    const response = await fetch(userinfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      // @ts-ignore - Node.js specific option
      ...(typeof window === "undefined" &&
        process.env.NODE_ENV === "development" && {
          agent: new (require("https").Agent)({ rejectUnauthorized: false }),
        }),
    });

    if (!response.ok) {
      throw new Error(`User info request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
}; 