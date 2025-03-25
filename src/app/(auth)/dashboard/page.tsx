"use client";

import { useEffect, useState } from "react";
import { getUserLanguage } from "@/actions/user";
import { useLanguage } from "@/contexts/language-context";
import { LanguageModal } from "@/components/language-modal";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const { language, setLanguage } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserLanguage = async () => {
      try {
        setLoading(true);
        // Verificar se o usuário tem idioma configurado
        const { language: userLanguage } = await getUserLanguage();
        
        // Se o usuário não tiver idioma, mostrar modal para selecionar
        if (!userLanguage) {
          setShowLanguageModal(true);
        } else {
          // Se tiver, definir o idioma da aplicação
          setLanguage(userLanguage as any);
        }
      } catch (error) {
        console.error("Erro ao verificar idioma do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserLanguage();
  }, [setLanguage]);

  const handleLanguageSelected = async (selectedLanguage: string) => {
    setShowLanguageModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <LanguageModal 
        isOpen={showLanguageModal} 
        onClose={handleLanguageSelected} 
      />
      
      <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Pacientes</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">
            0 novos pacientes este mês
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Médicos</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M8.56 3.69a9 9 0 0 0-2.92 1.95" />
              <path d="M3.69 8.56A9 9 0 0 0 3 12" />
              <path d="M3.69 15.44a9 9 0 0 0 1.95 2.92" />
              <path d="M8.56 20.31A9 9 0 0 0 12 21" />
              <path d="M15.44 20.31a9 9 0 0 0 2.92-1.95" />
              <path d="M20.31 15.44A9 9 0 0 0 21 12" />
              <path d="M20.31 8.56a9 9 0 0 0-1.95-2.92" />
              <path d="M15.44 3.69A9 9 0 0 0 12 3" />
              <circle cx="12" cy="12" r="2" />
            </svg>
          </div>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">
            0 novos médicos este mês
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Consultas</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </div>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">
            0 consultas marcadas para hoje
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Receita</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="text-2xl font-bold">R$ 0,00</div>
          <p className="text-xs text-muted-foreground">
            +0% comparado ao mês anterior
          </p>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-bold">Bem-vindo, {session?.user?.name || "Usuário"}</h2>
        <p className="text-muted-foreground">
          Esta é sua área administrativa. A partir daqui você pode gerenciar todas as 
          funções da clínica.
        </p>
        <p>Seu idioma atual é: {language}</p>
      </div>
    </div>
  );
} 