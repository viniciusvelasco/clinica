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
  ChevronRight,
  Menu,
  Building2,
  ChevronDown,
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
          icon: <Building2 className="h-4 w-4" />,
          href: "/cadastros/clinica",
        },
        {
          label: "Médico",
          icon: <UserCog className="h-4 w-4" />,
          href: "/cadastros/medico",
        },
        {
          label: "Paciente",
          icon: <Users className="h-4 w-4" />,
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
          icon: <Building2 className="h-4 w-4" />,
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
    <div className={cn("flex h-full flex-col gap-4", className)}>
      <div className="flex h-14 items-center px-3 justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 ml-auto"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronRight
            className={cn(
              "h-5 w-5 transition-transform",
              isCollapsed ? "rotate-180" : ""
            )}
          />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {menuItems.map((item, index) => {
          if (item.items) {
            const isOpen = openGroups.includes(item.label);
            return (
              <div key={item.label} className="space-y-1">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 hover:bg-muted/50",
                    isCollapsed ? "px-3" : "px-4"
                  )}
                  onClick={() => !isCollapsed && toggleGroup(item.label)}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-3">
                          {item.icon}
                          {!isCollapsed && (
                            <>
                              <span>{item.label}</span>
                              <ChevronDown
                                className={cn(
                                  "ml-auto h-4 w-4 transition-transform",
                                  isOpen ? "rotate-180" : ""
                                )}
                              />
                            </>
                          )}
                        </div>
                      </TooltipTrigger>
                      {isCollapsed && (
                        <TooltipContent side="right">
                          {item.label}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                </Button>
                {!isCollapsed && isOpen && (
                  <div className="space-y-1 pl-6">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href || "#"}
                        className={cn(
                          "group flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium hover:bg-muted/50",
                          pathname === subItem.href
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "text-muted-foreground hover:text-foreground"
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
            <TooltipProvider key={item.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href || "#"}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium hover:bg-muted/50",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "text-muted-foreground hover:text-foreground",
                      isCollapsed && "justify-center px-3"
                    )}
                  >
                    {item.icon}
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">{item.label}</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          );
        })}
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
        "flex h-screen border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <SidebarContent />
    </div>
  );
} 