"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import {
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const { data: session } = useSession();
  const [showNotifications, setShowNotifications] = useState(false);

  // Função para obter as iniciais do nome
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.split(" ")[0][0]?.toUpperCase() || "U";
  };

  // Notificações dummy
  const notifications = [
    {
      id: 1,
      title: "Nova consulta agendada",
      description: "Paciente João Silva agendou para 15/04",
      time: "há 5 minutos",
    },
    {
      id: 2,
      title: "Lembrete de consulta",
      description: "Consulta com Maria Santos em 1 hora",
      time: "há 30 minutos",
    },
    {
      id: 3,
      title: "Atualização do sistema",
      description: "Novas funcionalidades disponíveis",
      time: "há 2 horas",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo e nome do sistema */}
        <div className="flex items-center gap-3 px-4">
          <Link href="/dashboard" className="flex items-center gap-3 transition-opacity hover:opacity-90">
            <Image
              src="/medical-logo.svg"
              alt="Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="hidden font-bold lg:inline-block text-lg">
              Sistema Clínico
            </span>
          </Link>
        </div>

        {/* Ações do usuário */}
        <div className="ml-auto flex items-center gap-3 px-4">
          {/* Botão de ajuda */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-muted">
                <HelpCircle className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72">
              <div className="space-y-2">
                <h4 className="font-medium">Precisa de ajuda?</h4>
                <p className="text-sm text-muted-foreground">
                  Acesse nossa base de conhecimento ou entre em contato com o suporte.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Documentação
                  </Button>
                  <Button size="sm" className="flex-1">
                    Suporte
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Notificações */}
          <Popover open={showNotifications} onOpenChange={setShowNotifications}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-10 w-10 hover:bg-muted">
                <Bell className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  3
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Notificações</h4>
                  <Button variant="ghost" size="sm">
                    Marcar todas como lidas
                  </Button>
                </div>
                <Separator />
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      className="w-full rounded-lg p-3 text-left transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      onClick={() => {
                        // Aqui você pode adicionar a ação ao clicar na notificação
                        console.log('Notificação clicada:', notification.id);
                      }}
                    >
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium leading-none">
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.time}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
                <Separator />
                <Button variant="ghost" className="w-full justify-center">
                  Ver todas
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Avatar e menu do usuário */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full hover:bg-muted"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={session?.user?.image || undefined}
                    alt={session?.user?.name || ""}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(session?.user?.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session?.user?.image || undefined}
                      alt={session?.user?.name || ""}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(session?.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {session?.user?.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {session?.user?.email}
                    </span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    asChild
                  >
                    <Link href="/perfil">
                      <User className="h-4 w-4" />
                      Perfil
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    asChild
                  >
                    <Link href="/configuracoes">
                      <Settings className="h-4 w-4" />
                      Configurações
                    </Link>
                  </Button>
                </div>
                <Separator />
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-red-500 hover:text-red-500 hover:bg-red-50"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
} 