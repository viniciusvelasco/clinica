import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    maxAge: 8 * 60 * 60, // 8 hours
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        // Verificar credenciais do admin
        if (
          email === process.env.ADMIN_EMAIL &&
          await bcrypt.compare(password, await bcrypt.hash(process.env.ADMIN_PASSWORD || "", 10))
        ) {
          return {
            id: "1",
            email: process.env.ADMIN_EMAIL,
            name: "Administrador",
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
} satisfies NextAuthConfig; 