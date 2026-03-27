import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        const username = credentials.username as string;
        const password = credentials.password as string;

        if (!username || !password) return null;

        const user = await prisma.user.findUnique({
          where: { username },
          include: {
            tenants: {
              include: { tenant: true },
            },
          },
        });

        if (!user) return null;

        const valid = await compare(password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          tenants: user.tenants.map((ut) => ({
            id: ut.tenant.id,
            slug: ut.tenant.slug,
            name: ut.tenant.name,
          })),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as Record<string, unknown>).username;
        token.tenants = (user as Record<string, unknown>).tenants;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.username = token.username as string;
      session.user.tenants = token.tenants as {
        id: string;
        slug: string;
        name: string;
      }[];
      return session;
    },
  },
});
