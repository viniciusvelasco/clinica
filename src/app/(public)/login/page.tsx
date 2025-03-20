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
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/70 to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col justify-center h-full p-16 max-w-3xl">
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-white mb-6">
                {process.env.NEXT_PUBLIC_SYSTEM_NAME}
              </h1>
              <p className="text-2xl text-white/90">
                Transformando a gestão da sua clínica com tecnologia e inovação
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 space-y-6">
              <p className="text-lg text-white/90">
                Simplifique processos, otimize agendamentos e melhore a experiência dos seus pacientes com nossa solução completa.
              </p>
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">+1000</div>
                  <div className="text-sm text-white/80 mt-1">Pacientes Atendidos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">98%</div>
                  <div className="text-sm text-white/80 mt-1">Satisfação</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">-30%</div>
                  <div className="text-sm text-white/80 mt-1">Tempo de Espera</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário de Login */}
      <div className="w-full lg:w-[30%] flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">
              Acesso ao Sistema
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Entre com suas credenciais para continuar
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
                  className="block text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground"
                >
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
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