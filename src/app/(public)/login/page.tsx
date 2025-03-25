"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { 
  Calendar, 
  ClipboardList, 
  BarChart3, 
  CreditCard,
  Shield,
  Clock,
  Users
} from "lucide-react";

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
      <div className="hidden md:flex md:w-[70%] flex-col items-center justify-center p-0 relative">
        {/* Background image */}
        <div className="absolute inset-0 w-full h-full">
          <Image 
            src="/images/medical-background.jpg" 
            alt="Background" 
            fill 
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-800/60 to-blue-600/40 backdrop-blur-sm" />
        </div>
        
        <div className="relative z-10 max-w-2xl mx-auto text-center px-6">
          <div className="w-32 h-32 mx-auto mb-6 bg-white/20 backdrop-blur-md rounded-full p-5 shadow-xl">
            <img
              src="/medical-logo.svg"
              alt="Clínica Logo"
              className="w-full h-full"
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
            Sistema de Gestão Clínica
          </h1>
          
          <p className="text-xl text-white/90 mb-8 drop-shadow">
            Simplifique o atendimento e potencialize seus resultados
          </p>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-md">
              Tudo o que você precisa em um só lugar
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
              <div className="flex items-start space-x-3">
                <Calendar className="w-6 h-6 text-blue-100 mt-0.5 flex-shrink-0" strokeWidth={2} />
                <div>
                  <h3 className="font-semibold mb-1">Agendamento Inteligente</h3>
                  <p className="text-sm text-blue-100/90">Gerenciamento de consultas sem conflitos</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <ClipboardList className="w-6 h-6 text-blue-100 mt-0.5 flex-shrink-0" strokeWidth={2} />
                <div>
                  <h3 className="font-semibold mb-1">Prontuário Eletrônico</h3>
                  <p className="text-sm text-blue-100/90">Histórico completo e acessível</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CreditCard className="w-6 h-6 text-blue-100 mt-0.5 flex-shrink-0" strokeWidth={2} />
                <div>
                  <h3 className="font-semibold mb-1">Gestão Financeira</h3>
                  <p className="text-sm text-blue-100/90">Controle completo de receitas e despesas</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <BarChart3 className="w-6 h-6 text-blue-100 mt-0.5 flex-shrink-0" strokeWidth={2} />
                <div>
                  <h3 className="font-semibold mb-1">Relatórios Detalhados</h3>
                  <p className="text-sm text-blue-100/90">Análises e insights para decisões</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-6 h-6 text-blue-100 mt-0.5 flex-shrink-0" strokeWidth={2} />
                <div>
                  <h3 className="font-semibold mb-1">Otimização de Tempo</h3>
                  <p className="text-sm text-blue-100/90">Automação de tarefas rotineiras</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Users className="w-6 h-6 text-blue-100 mt-0.5 flex-shrink-0" strokeWidth={2} />
                <div>
                  <h3 className="font-semibold mb-1">Gestão de Pacientes</h3>
                  <p className="text-sm text-blue-100/90">Acompanhamento completo e personalizado</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-100 mr-2" />
              <p className="text-sm text-blue-100">Dados protegidos com criptografia de ponta a ponta</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lado direito - 30% */}
      <div className="w-full md:w-[30%] flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          {/* Versão mobile do background e logo */}
          <div className="md:hidden relative w-full h-40 mb-8 rounded-xl overflow-hidden">
            <Image 
              src="/images/medical-background.jpg" 
              alt="Background" 
              fill 
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-800/60 to-blue-600/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full p-4 shadow-xl">
                <img
                  src="/medical-logo.svg"
                  alt="Clínica Logo"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Acesse sua conta</h2>
            <p className="text-gray-500 mt-2">Insira suas credenciais para continuar</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-md text-sm text-red-600 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
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
                className="block w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
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
                className="block w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
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
              className="w-full bg-primary hover:bg-primary/90 text-white py-2.5"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
            
            <div className="mt-4 text-center text-xs text-gray-500">
              Ao acessar, você concorda com nossos
              <a href="/politica-privacidade" className="text-primary hover:text-primary/80 mx-1">
                Termos de Uso e Política de Privacidade
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 