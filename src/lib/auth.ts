import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signIn as nextAuthSignIn } from "next-auth/react";

import { db } from "@/lib/db";

export const authConfig = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await db.user.findUnique({
          where: { email }
        });
        console.log(user);
        if (!user || !user.password) return null;

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) return null;

        // Registrar histórico de login
        await db.historicoLogin.create({
          data: {
            userId: user.id,
            timestamp: new Date(),
          },
        });

        return {
          id: user.id,
          email: user.email || "",
          name: user.name || "",
          role: user.role || "user",
          image: user.image || undefined
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as string;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await db.user.findUnique({
        where: {
          id: token.sub,
        },
      });

      if (!existingUser) return token;

      token.role = existingUser.role;

      return token;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signOut } = NextAuth(authConfig);

export const signIn = async (credentials: { email: string; password: string }) => {
  try {
    const result = await nextAuthSignIn("credentials", {
      ...credentials,
      redirect: false,
    });

    // Registrar acesso após login bem-sucedido
    if (result?.ok && !result?.error) {
      // Obter o usuário atual
      const session = await auth();
      
      if (session?.user?.id) {
        // Registrar acesso
        try {
          await fetch('/api/auth/acesso', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: session.user.id }),
          });
        } catch (error) {
          console.error('Erro ao registrar acesso:', error);
          // Não interromper o fluxo de login se o registro de acesso falhar
        }
      }
    }

    return result;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw new Error("Falha na autenticação");
  }
}; 