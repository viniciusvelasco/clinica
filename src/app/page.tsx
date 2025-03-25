import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="container flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Clínica
        </h1>
        <p className="text-muted-foreground text-lg">
          Sistema de gerenciamento de clínica com Next.js, Tailwind CSS, shadcn/ui e Prisma ORM
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button asChild>
            <Link href="/login">Entrar</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </main>
  );
}
