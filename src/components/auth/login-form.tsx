"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { WhiteInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ExclamationTriangleIcon, EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { z } from "zod";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: formSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setError(null);
    setBlockTimeRemaining(null);

    try {
      // Tentar fazer login com as credenciais fornecidas
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error === "TOO_MANY_REQUESTS") {
        setError("Muitas tentativas de login. Tente novamente mais tarde.");
        return;
      }

      if (result?.error) {
        // Verifica se o erro é de rate limiting
        if (result.error.startsWith("RATE_LIMITED:")) {
          const remainingTime = parseInt(result.error.split(":")[1], 10);
          setBlockTimeRemaining(remainingTime);
          setError(`Muitas tentativas de login. Tente novamente em ${formatBlockTime(remainingTime)}.`);
        } else {
          setError("Email ou senha inválidos");
        }
        return;
      }

      // Se o login for bem-sucedido, buscar dados da sessão para verificar MFA
      const session = await getSession();
      
      if (session?.user?.requiresMFA) {
        // Se o usuário tiver MFA ativado, gerar um desafio e redirecionar para a página de verificação
        await fetch("/api/auth/mfa/generate-challenge", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            userId: session.user.id 
          }),
        });
        
        // Redirecionar para a página de verificação MFA
        router.push(`/auth/mfa-verify?userId=${session.user.id}`);
      } else {
        // Se não houver MFA, redirecionar diretamente para o dashboard
        const returnUrl = searchParams.get("callbackUrl") || "/dashboard";
        router.push(returnUrl);
      }
    } catch (error: unknown) {
      console.error("Erro durante login:", error);
      setError("Ocorreu um erro ao processar o login. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Formata o tempo de bloqueio restante para exibição
  const formatBlockTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds} segundo${seconds === 1 ? '' : 's'}`;
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (remainingSeconds === 0) {
      return `${minutes} minuto${minutes === 1 ? '' : 's'}`;
    }
    
    return `${minutes} minuto${minutes === 1 ? '' : 's'} e ${remainingSeconds} segundo${remainingSeconds === 1 ? '' : 's'}`;
  };

  const isFormDisabled = blockTimeRemaining !== null;
  const systemName = process.env.NEXT_PUBLIC_SYSTEM_NAME || "Sistema Médico";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full min-h-full flex items-center justify-center py-6 sm:py-8 px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block mb-3 p-3 bg-[#3A86FF]/10 rounded-2xl">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-[#3A86FF]" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1B1F3B] mb-2">Bem-vindo de volta</h2>
          <p className="text-sm sm:text-base text-[#6C7086]">Entre com suas credenciais para acessar o {systemName}</p>
        </div>
        
        <div className="bg-[#F8F9FA]/50 backdrop-blur-sm rounded-xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-[#EF4444]/10 p-3 border-l-4 border-[#EF4444] animate-pulse">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-[#EF4444] mr-2 flex-shrink-0" />
                  <p className="text-xs sm:text-sm font-medium text-[#EF4444]">{error}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label 
                  htmlFor="email"
                  className={cn(errors.email ? "text-[#EF4444]" : "text-[#1B1F3B]")}
                >
                  Email
                </Label>
                <WhiteInput
                  id="email"
                  type="email"
                  autoComplete="email"
                  disabled={isFormDisabled}
                  placeholder="seu.email@exemplo.com"
                  {...register("email")}
                  className={cn(
                    errors.email ? "border-[#EF4444] ring-[#EF4444]/20" : "border-[#E2E8F0]",
                    "focus-visible:ring-[#3A86FF]/20 text-[#1B1F3B]"
                  )}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-sm text-[#EF4444]">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label 
                  htmlFor="password"
                  className={cn(errors.password ? "text-[#EF4444]" : "text-[#1B1F3B]")}
                >
                  Senha
                </Label>
                <div className="relative">
                  <WhiteInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    disabled={isFormDisabled}
                    placeholder="••••••••"
                    {...register("password")}
                    className={cn(
                      errors.password ? "border-[#EF4444] ring-[#EF4444]/20" : "border-[#E2E8F0]",
                      "focus-visible:ring-[#3A86FF]/20 pr-10 text-[#1B1F3B]"
                    )}
                    aria-invalid={!!errors.password}
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6C7086] hover:text-[#1B1F3B]"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                  >
                    {showPassword ? (
                      <EyeClosedIcon className="h-4 w-4" />
                    ) : (
                      <EyeOpenIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-[#EF4444]">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember-me" className="border-[#E2E8F0] text-[#3A86FF] data-[state=checked]:bg-[#3A86FF] data-[state=checked]:text-white" />
                <Label
                  htmlFor="remember-me"
                  className="text-xs sm:text-sm text-[#6C7086]"
                >
                  Lembrar-me
                </Label>
              </div>

              <a
                href="#"
                className="text-xs sm:text-sm font-medium text-[#3A86FF] hover:text-[#3A86FF]/90 transition-colors"
              >
                Esqueceu a senha?
              </a>
            </div>
            
            <Button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#3A86FF] text-white hover:bg-[#3A86FF]/90"
              disabled={isFormDisabled || formSubmitting}
            >
              {formSubmitting ? "Entrando..." : (isFormDisabled ? "Bloqueado" : "Entrar")}
            </Button>
            
            <p className="text-center text-xs text-[#6C7086]">
              Ao fazer login, você concorda com nossos{" "}
              <a href="#" className="text-[#3A86FF] hover:underline">
                Termos de Uso
              </a>{" "}
              e{" "}
              <a href="#" className="text-[#3A86FF] hover:underline">
                Política de Privacidade
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
} 