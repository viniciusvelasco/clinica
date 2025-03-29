import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signIn as nextAuthSignIn } from "next-auth/react";
import { authenticator } from "otplib";

import { db } from "@/lib/db";

export const authConfig = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  debug: true,
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
        mfaCode: { label: "Código MFA", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        console.log("Autenticando usuário");
        const email = credentials.email as string;
        const password = credentials.password as string;
        const mfaCode = credentials.mfaCode as string | undefined;

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
        console.log(user);
        if (!user || !user.password) return null;

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) return null;
        
        // Verificar se o usuário tem MFA habilitado
        if (user.mfaEnabled && user.mfaSecret) {
          // Se o código MFA não foi fornecido, solicitar verificação MFA
          if (!mfaCode) {
            // Formato: "MFA_REQUIRED:userId:secret"
            throw new Error(`MFA_REQUIRED:${user.id}:${user.mfaSecret}`);
          }
          
          // Se o código foi fornecido, verificar (normalmente com uma biblioteca TOTP)
          // Por simplicidade, aceitamos qualquer código de 6 dígitos neste exemplo
          if (!/^\d{6}$/.test(mfaCode)) {
            return null;
          }
          
          // Em um cenário real, validamos o código MFA aqui:
          const isValidCode = authenticator.verify({ token: mfaCode, secret: user.mfaSecret });
          if (!isValidCode) return null;
        }

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
          
          // Registrar histórico de forma assíncrona sem bloquear o login
          Promise.resolve().then(async () => {
            try {
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
            } catch (registroError) {
              console.error("Erro ao registrar histórico de acesso:", registroError);
            }
          });
        } catch (error) {
          // Apenas log do erro, não interrompe o login
          console.error("Erro ao processar dados para histórico:", error);
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

export const signIn = async (credentials: { 
  email: string; 
  password: string;
  mfaCode?: string;
}, req?: Request) => {
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