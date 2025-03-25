"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Carregar email do localStorage se existir
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Salvar ou remover email do localStorage baseado no checkbox
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Credenciais inválidas");
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError("Ocorreu um erro ao fazer login");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Lado esquerdo - 70% */}
      <div className="hidden md:flex md:w-[70%] bg-blue-50 flex-col items-center justify-center p-10 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100/50 to-white/20" />
        
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="w-32 h-32 mx-auto mb-6">
            <img
              src="/medical-logo.svg"
              alt="Clínica Logo"
              className="w-full h-full"
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Sistema de Gestão Clínica
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Simplifique o atendimento e potencialize seus resultados
          </p>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 mt-8">
            <h2 className="text-2xl font-bold text-primary mb-3">
              Tudo o que você precisa em um só lugar
            </h2>
            <ul className="text-gray-700 text-left space-y-2">
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Agendamento inteligente de consultas
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Prontuário eletrônico completo
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Gestão financeira e faturamento
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Relatórios e análises detalhados
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Lado direito - 30% */}
      <div className="w-full md:w-[30%] flex items-center justify-center p-4 md:p-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            {/* Logo em telas menores */}
            <div className="w-20 h-20 mx-auto mb-4 md:hidden">
              <img
                src="/medical-logo.svg"
                alt="Clínica Logo"
                className="w-full h-full"
              />
            </div>
            <h2 className="text-2xl font-bold">Acesse sua conta</h2>
            <p className="text-gray-500 mt-2">Insira suas credenciais para continuar</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-md text-sm text-red-600 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary/80">
                    Esqueceu a senha?
                  </a>
                </div>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Lembrar meu email
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary py-2.5"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 