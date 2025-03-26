import { HeartIcon } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t py-3 px-4 bg-muted/30">
      <div className="container flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <span>© {currentYear} Sistema de Gestão Clínica</span>
        </div>
        <div className="flex items-center gap-1">
          <span>Desenvolvido com</span>
          <HeartIcon className="h-4 w-4 text-destructive" />
          <span>por Clínica Virtual</span>
        </div>
        <div>
          <span>v1.0.0</span>
        </div>
      </div>
    </footer>
  );
} 