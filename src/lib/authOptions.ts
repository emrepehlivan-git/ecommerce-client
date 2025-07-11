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
        
        // Decode JWT to extract roles
        try {
          const base64Url = account.access_token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          
          const decodedToken = JSON.parse(jsonPayload);
          
          // Extract roles from resource_access
          let roles: string[] = [];
          if (decodedToken.resource_access?.[clientId]?.roles) {
            roles = decodedToken.resource_access[clientId].roles;
          }
          
          token.roles = roles.filter(role => role && role.trim().length > 0);
        } catch (error) {
          console.error("Failed to decode JWT:", error);
          token.roles = [];
        }
      }

      if (profile) {
        const anyProfile = profile as any;
        token.id = anyProfile.sub ?? "";
        token.name = anyProfile.name ?? "";
        token.email = anyProfile.email ?? "";
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
      session.user.roles = token.roles || [];
      session.accessToken = token.accessToken;
      session.error = token.error;
      
      return session;
    },
  },
};

export const isAuthenticated = async (): Promise<boolean> => {
  const session = await auth();
  return session?.user ? true : false;
};
