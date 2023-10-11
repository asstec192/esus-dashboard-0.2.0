import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";
import { type UserRole } from "@/types/UserRole";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & User;
  }
  interface User {
    id: string;
    username: string;
    name: string;
    role: UserRole;
    esusId: number
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          ...user
        };
      }
      return token;
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          username: token.username,
          role: token.role,
          esusId: token.esusId
        },
      };
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Usuário e-SUS SAMU*", type: "text" },
        password: { label: "Senha*", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials.password) {
          return null;
        }
        const dbUser = await prisma.usuarioDashboard.findFirst({
          include: {
            operador: {
              select: {
                OperadorNM: true,
                OperadorApelido: true,
                OperadoID: true
              },
            },
          },
          where: {
            operador: {
              OperadorApelido: credentials.username,
            },
          },
        });
        if (!dbUser) return null;
        const validPassword = bcrypt.compareSync(
          credentials.password,
          dbUser.senha,
        );
        if (!validPassword) return null;
        return {
          id: dbUser.id.toString(),
          username: dbUser.operador!.OperadorApelido!,
          name: dbUser.operador!.OperadorNM!,
          role: dbUser.role as UserRole,
          esusId: dbUser.operadorID
        };
      },
    }),
  ],
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
