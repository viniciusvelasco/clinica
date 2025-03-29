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
      language: true
    }
  });
  
  if (!user) {
    redirect("/login");
  }
  
  // Fornecer informações do MFA
  const userWithMFA = {
    ...user,
    // Verificar se o MFA está ativado verificando o prefixo "mfa:" no campo language
    mfaEnabled: user.language?.startsWith('mfa:') || false,
    // Extrair o segredo MFA do campo language se existir
    mfaSecret: user.language?.startsWith('mfa:') ? user.language.substring(4) : null,
    language: user.language || 'pt-BR'  // Garantir que o language sempre esteja presente
  };
  
  return (
    <main className="flex-1">
      <ConfiguracoesForm user={userWithMFA} />
    </main>
  );
} 