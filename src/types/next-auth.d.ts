import "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
      role: string[];
      permissions: string[];
    } & DefaultSession["user"];
    accessToken: unknown;
    error: unknown;
  }

  interface User extends DefaultUser {
    role: string[];
    permissions: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    name: string;
    email: string;
    role: string[];
    permissions: string[];
    accessToken: unknown;
    accessTokenExpires: number;
    error?: string;
  }
} 