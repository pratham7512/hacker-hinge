import type { NextAuthOptions, Session, User as NextAuthUser } from "next-auth";
import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { compare } from "bcryptjs";
import type { AdapterUser } from "next-auth/adapters";
import type { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<NextAuthUser | null> {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password || "";
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null;

        const isValid = await compare(password, user.passwordHash);
        if (!isValid) return null;

        if (!user.emailVerified) {
          throw new Error("Email not verified. Please verify with OTP.");
        }

        const resultUser: NextAuthUser = {
          id: user.id,
          email: user.email || undefined,
          name: user.name || undefined,
          image: user.image || undefined,
        };
        return resultUser;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        const userId = (user as AdapterUser | NextAuthUser).id;
        if (userId) {
          (token as JWT).userId = userId;
        }
      }
      return token as JWT;
    },
    async session({ session, token }): Promise<Session> {
      if (session.user && (token as JWT).userId) {
        (session.user as { id?: string }).id = (token as JWT).userId as string;
      }
      return session as Session;
    },
  },
};

export async function auth() {
  return getServerSession(authOptions);
}


