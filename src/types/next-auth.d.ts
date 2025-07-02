import "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string[] | null;
    } & DefaultSession["user"];
    accessToken?: string;
    error?: string;
  }

  interface User extends DefaultUser {
    role?: string[] | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    role?: string[] | null;
    accessToken?: string;
    accessTokenExpires?: number;
    hasRefreshToken?: boolean;
    error?: string;
  }
} 