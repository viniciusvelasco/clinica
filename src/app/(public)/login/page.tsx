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
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            <Image
              src="/images/medical-team.jpg"
              alt="Background médico"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 70vw"
              className="object-cover opacity-30"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#4361EE]/80 to-[#3A86FF]/70" />
        </div>

        {/* Conteúdo sobreposto */}
        <div className="relative z-10 text-center px-6 py-8 max-w-3xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 lg:mb-6 tracking-tight">
            {systemName}
          </h1>
          <p className="text-lg lg:text-xl text-white/80 mb-6 lg:mb-8 leading-relaxed">
            Um sistema completo para gestão de clínicas médicas, proporcionando
            atendimento de qualidade aos seus pacientes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-8 lg:mt-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm mb-2 lg:mb-3 mx-auto w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-white font-medium mb-1">{feature.title}</h3>
                <p className="text-white/70 text-xs lg:text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Destaque amarelo para decoração */}
        <div className="absolute bottom-8 right-8 w-20 h-20 rounded-full bg-[#FFD166]/30 backdrop-blur-sm"></div>
        <div className="absolute top-12 left-12 w-16 h-16 rounded-full bg-[#FFD166]/20 backdrop-blur-sm"></div>
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