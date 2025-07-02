import { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    error?: string
    user: {
      id: string
      role: string[]
      birthDate: Date
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    name: string | null
    email: string | null
    role: string[]
    birthDate: Date
    accessToken?: string
    hasRefreshToken?: boolean
    accessTokenExpires?: number
    error?: string
  }
} 