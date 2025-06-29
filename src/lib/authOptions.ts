import { type DefaultSession, NextAuthConfig } from "next-auth";
import { axiosClient } from "@/lib/axiosClient";
import { auth } from "./auth";

const issuer = process.env.NEXT_PUBLIC_AUTH_SERVER_URL;
const clientId = process.env.NEXT_PUBLIC_OPENIDDICT_CLIENT_ID;

const normalizedIssuer = issuer?.endsWith('/') ? issuer : `${issuer}/`;

const getInternalIssuer = () => {
  if (process.env.INTERNAL_AUTH_SERVER_URL) {
    return process.env.INTERNAL_AUTH_SERVER_URL?.endsWith('/') 
      ? process.env.INTERNAL_AUTH_SERVER_URL 
      : `${process.env.INTERNAL_AUTH_SERVER_URL}/`;
  }
  return normalizedIssuer;
};

async function refreshAccessToken(token: any) {
  try {
    
    if (!token.refreshToken) {
      throw new Error('No refresh token available');
    }

    const tokenUrl = typeof window === 'undefined' 
      ? `${getInternalIssuer()}connect/token`
      : `${normalizedIssuer}connect/token`;

    const response = await fetch(tokenUrl, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: new URLSearchParams({
        client_id: clientId!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    const tokens = await response.json();
    
    let userInfo = null;
    try {
      userInfo = await getUserInfo(tokens.access_token);
    } catch (userError) {
    }

    return {
      ...token,
      accessToken: tokens.access_token,
      accessTokenExpires: Date.now() + (tokens.expires_in || 3600) * 1000,
      refreshToken: tokens.refresh_token ?? token.refreshToken,
      ...(userInfo && {
        id: userInfo.sub,
        name: userInfo.fullName,
        email: userInfo.email,
        role: userInfo.role,
        birthDate: userInfo.birthDate,
      }),
      error: undefined,
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthConfig = {
  providers: [
    {
      id: "openiddict",
      name: "OpenIddict",
      type: "oauth",
      clientId,
      clientSecret: "",
      issuer: typeof window === 'undefined' ? getInternalIssuer() : normalizedIssuer,
      wellKnown: typeof window === 'undefined' 
        ? `${getInternalIssuer()}.well-known/openid-configuration`
        : `${normalizedIssuer}.well-known/openid-configuration`,
      authorization: {
        params: {
          scope: "openid profile email roles api offline_access",
          response_type: "code",
          code_challenge_method: "S256",
        },
        url: `${normalizedIssuer}connect/authorize`,
      },
      userinfo: {
        url: typeof window === 'undefined' 
          ? `${getInternalIssuer()}connect/userinfo`
          : `${normalizedIssuer}connect/userinfo`,
      },
      token: {
        url: typeof window === 'undefined' 
          ? `${getInternalIssuer()}connect/token`
          : `${normalizedIssuer}connect/token`,
      },
      profile: async (profile: any) => {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
      checks: ["pkce", "state"],
    },
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  trustHost: true,
  callbacks: {
    async jwt({ token, account, trigger }) {
      if (account?.access_token) {
        try {
          const user = await getUserInfo(account?.access_token as string);
          return {
            ...token,
            id: user.sub,
            name: user.fullName,
            email: user.email,
            role: user.role,
            birthDate: user.birthDate,
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            accessTokenExpires: account.expires_at ? account.expires_at * 1000 : Date.now() + 3600 * 1000,
            error: undefined,
          };
        } catch (error) {
          return {
            ...token,
            error: "UserInfoError",
          };
        }
      }

      if (token.error && !token.refreshToken) {
        return token;
      }

      const now = Date.now();
      const expiryTime = (token.accessTokenExpires as number) || 0;
      const bufferTime = 5 * 60 * 1000;

      if (expiryTime > now + bufferTime) {
        return { ...token, error: undefined };
      }

      if (!token.refreshToken) {
        return {
          ...token,
          error: "NoRefreshToken",
          accessToken: undefined,
        };
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token.error || !token.accessToken) {
        return {
          ...session,
          error: token.error as string || "NoAccessToken",
          user: {
            id: "",
            email: "",
            name: "",
            role: [],
            emailVerified: null,
            birthDate: null,
          },
          accessToken: undefined,
          expires: new Date(0).toISOString(),
        };
      }

      return {
        ...session,
        user: {
          id: token.id as string,
          email: token.email as string,
          name: token.name,
          role: token.role as string[],
          emailVerified: token.emailVerified as Date,
          birthDate: token.birthDate as Date,
        },
        accessToken: token.accessToken as string,
        error: undefined,
      };
    },
  },
};

const getUserInfo = async (accessToken: string) => {
  try {
    const userinfoUrl = typeof window === 'undefined' 
      ? `${getInternalIssuer()}connect/userinfo`
      : `${normalizedIssuer}connect/userinfo`;
      
    const response = await fetch(userinfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`User info request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  const session = await auth();
  return session?.user ? true : false;
};
