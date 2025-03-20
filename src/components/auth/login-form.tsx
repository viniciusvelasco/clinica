"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
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
          <div className="inline-block mb-3 p-3 bg-primary/10 rounded-2xl">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-primary" 
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
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Bem-vindo de volta</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Entre com suas credenciais para acessar o {systemName}</p>
        </div>
        
        <div className="bg-card/50 backdrop-blur-sm rounded-xl border shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 border-l-4 border-destructive animate-pulse">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-destructive mr-2 flex-shrink-0" />
                  <p className="text-xs sm:text-sm font-medium text-destructive">{error}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label 
                  htmlFor="email"
                  className={cn(errors.email ? "text-destructive" : "")}
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  disabled={isFormDisabled}
                  placeholder="seu.email@exemplo.com"
                  {...register("email")}
                  className={cn(
                    errors.email ? "border-destructive" : "",
                    "bg-background"
                  )}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label 
                  htmlFor="password"
                  className={cn(errors.password ? "text-destructive" : "")}
                >
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    disabled={isFormDisabled}
                    placeholder="••••••••"
                    {...register("password")}
                    className={cn(
                      errors.password ? "border-destructive" : "",
                      "bg-background pr-10"
                    )}
                    aria-invalid={!!errors.password}
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground"
                >
                  Lembrar-me
                </Label>
              </div>

              <Button
                variant="link"
                className="text-xs sm:text-sm font-medium px-0"
              >
                Esqueceu a senha?
              </Button>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isFormDisabled || formSubmitting}
            >
              {formSubmitting ? "Entrando..." : (isFormDisabled ? "Bloqueado" : "Entrar")}
            </Button>
            
            <p className="text-center text-xs text-muted-foreground">
              Ao fazer login, você concorda com nossos{" "}
              <Button variant="link" className="text-xs p-0 h-auto">
                Termos de Uso
              </Button>{" "}
              e{" "}
              <Button variant="link" className="text-xs p-0 h-auto">
                Política de Privacidade
              </Button>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
} 