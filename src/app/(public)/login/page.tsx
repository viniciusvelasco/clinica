"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const systemName = process.env.NEXT_PUBLIC_SYSTEM_NAME || "Sistema Médico";

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
    <div className="flex min-h-screen">
      {/* Área principal (70%) */}
      <div className="hidden lg:flex lg:w-[70%] relative overflow-hidden">
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
                {systemName}
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

      {/* Área de login (30%) */}
      <div className="w-full lg:w-[30%] bg-background">
        <LoginForm />
      </div>
    </div>
  );
}

const features = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 lg:h-8 lg:w-8 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
    title: "Agendamentos",
    description: "Gerencie consultas com facilidade",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 lg:h-8 lg:w-8 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    title: "Pacientes",
    description: "Histórico e prontuários completos",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 lg:h-8 lg:w-8 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Segurança",
    description: "Dados protegidos conforme LGPD",
  },
]; 