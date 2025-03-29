import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authenticator } from "otplib";

import { db } from "@/lib/db";

const registrarHistoricoAcesso = async (userId: string, req: Request) => {
  try {
    // Extrair informações do navegador e IP de forma segura
    let ip = "Desconhecido";
    let browser = "Desconhecido";
    
    if (req?.headers) {
      browser = req.headers.get("user-agent") || "Desconhecido";
      const forwarded = req.headers.get("x-forwarded-for") || "";
      const realIp = req.headers.get("x-real-ip") || "";
      
      ip = forwarded ? forwarded.split(",")[0].trim() : 
           realIp ? realIp : "Desconhecido";
    }
    
    // Registrar histórico de forma assíncrona sem bloquear o login
    await db.historicoAcesso.create({
      data: {
        userId,
        dataHora: new Date(),
        ip,
        browser,
        local: "Brasil"
      }
    });
    console.log("Histórico de acesso registrado com sucesso");
  } catch (error) {
    console.error("Erro ao registrar histórico de acesso:", error);
    // Não bloqueia o login em caso de falha no registro
  }
};

export const authConfig = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
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
          where: { email },
          select: {
            id: true,
            email: true,
            password: true,
            name: true,
            role: true,
            image: true,
            mfaEnabled: true,
            mfaSecret: true
          }
        });
        
        if (!user || !user.password) return null;

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) return null;
        
        // Verificar se o usuário tem MFA habilitado
        if (user.mfaEnabled && user.mfaSecret) {
          // Indicar que o usuário precisa de verificação MFA
          return {
            id: user.id,
            email: user.email || "",
            name: user.name || "",
            role: user.role || "user",
            image: user.image || undefined,
            mfaRequired: true,
            mfaSecret: user.mfaSecret
          };
        }

        // Registrar histórico de acesso para usuários sem MFA
        if (req) {
          try {
            // Usamos Promise.resolve para não bloquear o login
            Promise.resolve().then(() => registrarHistoricoAcesso(user.id, req as unknown as Request));
          } catch (error) {
            console.error("Erro ao iniciar registro de histórico:", error);
          }
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
    async redirect({ url, baseUrl }) {
      // Usa a URL atual como base para redirecionamentos relativos
      // em vez de uma URL estática
      const currentUrl = typeof window !== 'undefined' ? window.location.origin : baseUrl;
      
      // Se a URL começa com a base, retorne a URL
      if (url.startsWith(currentUrl)) {
        return url;
      }
      // Se for um caminho relativo, junte com a base atual
      else if (url.startsWith("/")) {
        return `${currentUrl}${url}`;
      }
      // Caso contrário, retorne a base
      return currentUrl;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signOut } = NextAuth(authConfig); 