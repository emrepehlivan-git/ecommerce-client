import { type DefaultSession, NextAuthConfig } from "next-auth";
import { axiosClient } from "@/lib/axiosClient";
import { auth } from "./auth";
import { UserDto } from "@/api/generated/model";

const issuer = process.env.NEXT_PUBLIC_AUTH_SERVER_URL;
const clientId = process.env.NEXT_PUBLIC_OPENIDDICT_CLIENT_ID;

export const authOptions: NextAuthConfig = {
  providers: [
    {
      id: "openiddict",
      name: "OpenIddict",
      type: "oauth",
      clientId,
      clientSecret: "",
      issuer,
      wellKnown: `${issuer}.well-known/openid-configuration`,
      authorization: {
        params: {
          scope: "openid profile email roles api",
          response_type: "code",
          code_challenge_method: "S256",
        },
        url: `${issuer}connect/authorize`,
      },
      userinfo: {
        url: `${issuer}connect/userinfo`,
      },
      token: {
        url: `${issuer}connect/token`,
      },
      profile: async (profile: any) => {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
      checks: ["pkce"],
    },
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        const user = await getUserInfo(account?.access_token as string);
        token.id = user.sub;
        token.name = user.fullName;
        token.email = user.email;
        token.role = user.role;
        token.birthDate = user.birthDate;
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
      return session;
    },
  },
};

const getUserInfo = async (accessToken: string) => {
  const { data } = await axiosClient.get(`${issuer}connect/userinfo`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
};

declare module "next-auth" {
  interface Session {
    user: {
      role: string[];
      birthDate: Date;
    } & DefaultSession["user"];
  }
}

export const isAuthenticated = async (): Promise<boolean> => {
  const session = await auth();
  return session?.user ? true : false;
};
