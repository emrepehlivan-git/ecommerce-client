import type { Session } from "next-auth";
import { auth } from "./auth";
import { getApiV1UsersPermissions } from "@/api/generated/users/users";

export const hasRole = (session: Session | null, role: string): boolean => {
  return session?.user?.role?.includes(role) ?? false;
};

async function getUserPermissions(): Promise<string[]> {
  try {
    const response = await getApiV1UsersPermissions();
    return response.data;
  } catch (error) {
    return [];
  }
}

export const hasPermission = async (permission: string): Promise<boolean> => {
  const session = await auth();
  if (!session) return false;

  const permissions = await getUserPermissions();
  return permissions.includes(permission);
};

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