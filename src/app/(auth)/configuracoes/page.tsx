import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ConfiguracoesForm } from "@/components/configuracoes/configuracoes-form";
import { db } from "@/lib/db";

export default async function ConfiguracoesPage() {
  // Verificar autenticação
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }
  
  // Buscar dados atualizados do usuário incluindo mfaEnabled e mfaSecret
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      language: true,
      mfaEnabled: true,
      mfaSecret: true
    }
  });
  
  if (!user) {
    redirect("/login");
  }
  
  return (
    <main className="flex-1">
      <ConfiguracoesForm user={user} />
    </main>
  );
} 