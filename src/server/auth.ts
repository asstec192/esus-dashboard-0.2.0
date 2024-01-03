import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/server/db";
import { UserRole } from "@/types/UserRole";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & User;
  }
  interface User {
    id: string;
    username: string;
    name: string;
    role: UserRole;
    esusId: number;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          ...user,
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
          esusId: token.esusId,
        },
      };
    },
  },
  adapter: PrismaAdapter(db),
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
        const dbUser = await db.usuarioDashboard.findFirst({
          include: {
            perfil: true,
            operador: {
              select: {
                OperadorNM: true,
                OperadorApelido: true,
                OperadoID: true,
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
          role: dbUser.perfil.sigla as UserRole,
          esusId: dbUser.operadorID,
        };
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
