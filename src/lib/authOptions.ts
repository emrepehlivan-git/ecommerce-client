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


export const authOptions: NextAuthConfig = {
  providers: [
    {
      id: "openiddict",
      name: "OpenIddict",
      type: "oauth",
      clientId,
      clientSecret: "",
      issuer: normalizedIssuer,
      wellKnown: typeof window === 'undefined' 
        ? `${getInternalIssuer()}.well-known/openid-configuration`
        : `${normalizedIssuer}.well-known/openid-configuration`,
      authorization: {
        params: {
          scope: "openid profile email roles api",
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
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        try {
          const user = await getUserInfo(account?.access_token as string);
          token.id = user.sub;
          token.name = user.fullName;
          token.email = user.email;
          token.role = user.role;
          token.birthDate = user.birthDate;
          token.accessToken = account.access_token;
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.name,
        role: token.role as string[],
        emailVerified: token.emailVerified as Date,
        birthDate: token.birthDate as Date,
      };
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
};

const getUserInfo = async (accessToken: string) => {
  try {
    // Server-side istekler için internal URL kullan
    const userinfoUrl = typeof window === 'undefined' 
      ? `${getInternalIssuer()}connect/userinfo`
      : `${normalizedIssuer}connect/userinfo`;
      
    const { data } = await axiosClient.get(userinfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error fetching user info from userinfo endpoint:", error);
    throw error;
  }
};

declare module "next-auth" {
  interface Session {
    user: {
      role: string[];
      birthDate: Date;
    } & DefaultSession["user"];
    accessToken?: string;
  }
  
  interface JWT {
    accessToken?: string;
  }
}

export const isAuthenticated = async (): Promise<boolean> => {
  const session = await auth();
  return session?.user ? true : false;
};
