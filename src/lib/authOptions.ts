import { NextAuthConfig } from "next-auth";
import { auth } from "./auth";

const issuer = process.env.NEXT_PUBLIC_AUTH_SERVER_URL;
const clientId = process.env.NEXT_PUBLIC_OPENIDDICT_CLIENT_ID;

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
    {
      id: "openiddict",
      name: "OpenIddict",
      type: "oauth",
      clientId,
      clientSecret: "",
      issuer: normalizedIssuer,
      wellKnown: `${normalizedIssuer}.well-known/openid-configuration`,
      authorization: {
        params: {
          scope: "openid profile email roles api offline_access",
          response_type: "code",
          code_challenge_method: "S256",
        },
        url: `${normalizedIssuer}connect/authorize`,
      },
      userinfo: {
        url:
          typeof window === "undefined"
            ? `${getInternalIssuer()}connect/userinfo`
            : `${normalizedIssuer}connect/userinfo`,
      },
      token: {
        url:
          typeof window === "undefined"
            ? `${getInternalIssuer()}connect/token`
            : `${normalizedIssuer}connect/token`,
      },
      profile: async (profile) => {
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
  experimental: {
    enableWebAuthn: false,
  },
  events: {
    async signIn(message) {
      console.log("NextAuth signIn event:", message);
    },
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : 0;
      }

      if (profile) {
        token.id = profile.sub ?? "";
      }

      if (Date.now() > (token.accessTokenExpires ?? Infinity)) {
        return { ...token, error: "RefreshAccessTokenError" };
      }

      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
      }
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
