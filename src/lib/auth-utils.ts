import type { Session } from "next-auth";
import { auth } from "./auth";

/**
 * Kullanıcının belirli bir role sahip olup olmadığını kontrol eder
 */
export async function hasRole(requiredRole: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.roles) return false;
  
  return session.user.roles.includes(requiredRole);
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
  if (!session?.user?.roles) return false;
  
  const adminRoles = ["admin", "superadmin", "Admin", "SuperAdmin"];
  
  return adminRoles.some(adminRole => 
    session.user.roles.some(userRole => userRole.toLowerCase() === adminRole.toLowerCase())
  );
}

/**
 * Client-side role kontrolü için hook benzeri fonksiyon
 */
export function checkUserRole(userRoles: string[] | undefined, requiredRole: string): boolean {
  if (!userRoles) return false;
  
  return userRoles.includes(requiredRole);
}

/**
 * Client-side admin kontrolü
 */
export function checkAdminAccess(userRoles: string[] | undefined): boolean {
  if (!userRoles) return false;
  
  const adminRoles = ["admin", "superadmin", "Admin", "SuperAdmin"];
  
  return adminRoles.some(adminRole => 
    userRoles.some(role => role.toLowerCase() === adminRole.toLowerCase())
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

export const getUserInfo = async (accessToken: string) => {
  const issuer =
    process.env.INTERNAL_AUTH_SERVER_URL || process.env.NEXT_PUBLIC_AUTH_SERVER_URL;
  const normalizedIssuer = issuer?.endsWith("/") ? issuer : `${issuer}/`;

  try {
    const userinfoUrl = `${normalizedIssuer}connect/userinfo`;

    const response = await fetch(userinfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error(`User info request failed with status: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}; 