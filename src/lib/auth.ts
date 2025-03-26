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

        // Registrar histórico de acesso
        try {
          // Extrair informações do navegador e IP de forma segura
          let ip = "Desconhecido";
          let browser = "Desconhecido";
          
          if (req?.headers && typeof req.headers.get === 'function') {
            browser = req.headers.get("user-agent") || "Desconhecido";
            const forwarded = req.headers.get("x-forwarded-for") || "";
            const realIp = req.headers.get("x-real-ip") || "";
            
            ip = forwarded ? forwarded.split(",")[0].trim() : 
                 realIp ? realIp : "Desconhecido";
          }
          
          await db.historicoAcesso.create({
            data: {
              userId: user.id,
              dataHora: new Date(),
              ip,
              browser,
              local: "Brasil"
            }
          });
          console.log("Histórico de acesso registrado com sucesso");
        } catch (error) {
          console.error("Erro ao registrar histórico de acesso:", error);
        }

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

export const signIn = async (credentials: { email: string; password: string }, req?: Request) => {
  try {
    const result = await nextAuthSignIn("credentials", {
      ...credentials,
      redirect: false,
    });

    return result;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw new Error("Falha na autenticação");
  }
}; 