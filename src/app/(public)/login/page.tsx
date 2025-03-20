"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      const response = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });

      if (response?.error) {
        setError("Credenciais inválidas");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      setError("Ocorreu um erro ao fazer login");
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Imagem e Marketing */}
      <div className="hidden lg:flex lg:w-[70%] bg-primary/10 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/medical-team.jpg"
            alt="Equipe médica"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-transparent" />
        </div>
        <div className="relative z-10 p-12 max-w-2xl">
          <h1 className="text-4xl font-bold text-white mb-4">
            {process.env.NEXT_PUBLIC_SYSTEM_NAME}
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Gestão inteligente para sua clínica médica
          </p>
          <div className="grid grid-cols-2 gap-8 text-white/80">
            <div className="space-y-2">
              <div className="text-2xl font-bold">+1000</div>
              <div className="text-sm">Pacientes Atendidos</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">98%</div>
              <div className="text-sm">Satisfação</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário de Login */}
      <div className="w-full lg:w-[30%] flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Bem-vindo de volta
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Faça login para acessar o sistema
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 