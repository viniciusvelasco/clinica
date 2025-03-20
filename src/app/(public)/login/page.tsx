"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginBanner } from "@/components/auth/login-banner";
import { LoginForm } from "@/components/auth/login-form";

const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const systemName = process.env.NEXT_PUBLIC_SYSTEM_NAME || "Sistema Médico";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
  };

  return (
    <div className="flex min-h-screen">
      {/* Área principal (70%) */}
      <div className="hidden lg:block lg:w-[70%]">
        <LoginBanner systemName={systemName} />
      </div>

      {/* Área de login (30%) */}
      <div className="w-full lg:w-[30%] bg-background">
        <LoginForm onSubmit={handleSubmit} error={error} />
      </div>
    </div>
  );
};

export default LoginPage; 