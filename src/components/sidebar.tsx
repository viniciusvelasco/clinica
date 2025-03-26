"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCog,
  Settings,
  Menu,
  Building2,
  ChevronLeft,
  ChevronRight,
  PanelLeft,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
}

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  items?: MenuItem[];
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  // Detectar se é mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Função para obter todos os itens (incluindo subitens)
  const getAllItems = () => {
    let allItems: MenuItem[] = [];
    
    menuItems.forEach(item => {
      if (item.items) {
        // Adiciona os subitens diretamente à lista
        allItems = [...allItems, ...item.items];
      } else {
        // Adiciona o item normal
        allItems.push(item);
      }
    });
    
    return allItems;
  };

  const menuItems: MenuItem[] = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/dashboard",
    },
    {
      label: "Agendamento",
      icon: <Calendar className="h-5 w-5" />,
      href: "/agendamento",
    },
    {
      label: "Cadastros",
      icon: <Users className="h-5 w-5" />,
      items: [
        {
          label: "Clínica",
          icon: <Building2 className="h-5 w-5" />,
          href: "/cadastros/clinica",
        },
        {
          label: "Médico",
          icon: <UserCog className="h-5 w-5" />,
          href: "/cadastros/medico",
        },
        {
          label: "Paciente",
          icon: <Users className="h-5 w-5" />,
          href: "/cadastros/paciente",
        },
      ],
    },
    {
      label: "Parâmetros",
      icon: <Settings className="h-5 w-5" />,
      items: [
        {
          label: "Clínica",
          icon: <Building2 className="h-5 w-5" />,
          href: "/parametros/clinica",
        },
      ],
    },
  ];

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) =>
      prev.includes(label)
        ? prev.filter((group) => group !== label)
        : [...prev, label]
    );
  };

  const SidebarContent = () => (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex justify-between items-center py-2 px-4 border-b">
        {!isCollapsed && <span className="font-medium text-sm">Menu</span>}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-muted/50 hover:bg-muted"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {isCollapsed ? (
          // Modo colapsado: mostra todos os itens de menu (incluindo subitens de grupos)
          getAllItems().map((item) => (
            <TooltipProvider key={item.href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href || "#"}
                    className={cn(
                      "flex justify-center items-center h-10 w-10 rounded-full mx-auto my-2",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {item.icon}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))
        ) : (
          // Modo expandido: mostra grupos expansíveis
          menuItems.map((item) => {
            if (item.items) {
              const isOpen = openGroups.includes(item.label);
              return (
                <div key={item.label} className="space-y-1">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between items-center px-3 py-2 text-sm font-medium rounded-lg",
                      isOpen ? "bg-muted" : "hover:bg-muted/50"
                    )}
                    onClick={() => toggleGroup(item.label)}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight 
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isOpen ? "rotate-90" : ""
                      )}
                    />
                  </Button>
                  {isOpen && (
                    <div className="pl-4 space-y-1 mt-1">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href || "#"}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg",
                            pathname === subItem.href
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          )}
                        >
                          {subItem.icon}
                          <span>{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href || "#"}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })
        )}
      </nav>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className={cn(
        "border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      <SidebarContent />
    </div>
  );
} 