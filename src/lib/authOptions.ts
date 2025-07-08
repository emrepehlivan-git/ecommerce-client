import { NextAuthConfig } from "next-auth";
import { auth } from "./auth";
import Keycloak from "next-auth/providers/keycloak";

const realm = "ecommerce";
const issuer = process.env.NEXT_PUBLIC_AUTH_SERVER_URL;
const clientId = process.env.NEXT_PUBLIC_OPENIDDICT_CLIENT_ID ?? "nextjs-client";
const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET ?? "";

const normalizedIssuer = issuer?.endsWith("/") ? issuer : `${issuer}/`;

const getInternalIssuer = () => {
  if (process.env.INTERNAL_AUTH_SERVER_URL) {
    return process.env.INTERNAL_AUTH_SERVER_URL?.endsWith("/")
      ? process.env.INTERNAL_AUTH_SERVER_URL
      : `${process.env.INTERNAL_AUTH_SERVER_URL}/`;
  }
  return normalizedIssuer;
};

export const authOptions: NextAuthConfig = {
  providers: [
    Keycloak({
      clientId,
      clientSecret,
      issuer: `${normalizedIssuer}realms/${realm}`,
      authorization: {
        url: `${normalizedIssuer}realms/${realm}/protocol/openid-connect/auth`,
        params: {
          scope: "openid email profile",
        },
      },
      token: `${getInternalIssuer()}realms/${realm}/protocol/openid-connect/token`,
      userinfo: `${getInternalIssuer()}realms/${realm}/protocol/openid-connect/userinfo`,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 2 saat
  },
  jwt: {
    maxAge: 2 * 60 * 60, // 2 saat
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 2 * 60 * 60, // 2 saat
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
  trustHost: true,
  experimental: {
    enableWebAuthn: false,
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
        token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : 0;
      }

      if (profile) {
        const anyProfile = profile as any;
        token.id = anyProfile.sub ?? "";
        token.name = anyProfile.name ?? "";
        token.email = anyProfile.email ?? "";
        
        let clientRoles: string[] = [];
        
        if (anyProfile.resource_access?.[clientId]?.roles) {
          clientRoles = anyProfile.resource_access[clientId].roles;
        }
        
        const filteredRoles = clientRoles.filter(role => 
          role && role.trim().length > 0
        );
        
        token.role = filteredRoles;
        token.permissions = (anyProfile.permissions as string[]) ?? [];
      }

      if (Date.now() > (token.accessTokenExpires ?? Infinity)) {
        return { ...token, error: "RefreshAccessTokenError" };
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id || "";
      session.user.name = token.name;
      session.user.email = token.email ?? "";
      session.user.role = token.role;
      session.accessToken = token.accessToken;
      session.error = token.error;
      
      if (token.accessToken && !token.permissions?.length) {
        try {
          const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;
          const response = await fetch(`${apiUrl}/api/v1/Users/permissions`, {
            headers: {
              "Authorization": `Bearer ${token.accessToken}`,
              "Content-Type": "application/json",
            },
          });
          
          if (response.ok) {
            const permissions = await response.json();
            token.permissions = permissions;
            session.user.permissions = permissions;
          } else {
            session.user.permissions = [];
          }
        } catch (error) {
          console.error("Failed to fetch permissions:", error);
          session.user.permissions = [];
        }
      } else {
        session.user.permissions = token.permissions || [];
      }
      
      return session;
    },
  },
};

export const isAuthenticated = async (): Promise<boolean> => {
  const session = await auth();
  return session?.user ? true : false;
};
