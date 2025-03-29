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
  
  // Buscar dados atualizados do usuário incluindo todos os campos necessários
  try {
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
    
    console.log("Dados do usuário carregados:", {
      id: user?.id,
      hasMfa: !!user?.mfaEnabled,
      hasSecret: !!user?.mfaSecret,
      language: user?.language
    });
    
    if (!user) {
      redirect("/login");
    }
    
    return (
      <main className="flex-1">
        <ConfiguracoesForm user={user} />
      </main>
    );
  } catch (error) {
    console.error("Erro ao carregar dados do usuário:", error);
    
    // Em caso de erro, fornecemos um objeto de usuário básico
    return (
      <main className="flex-1">
        <ConfiguracoesForm 
          user={{
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            mfaEnabled: false,
            mfaSecret: null,
            language: 'pt-BR'
          }} 
        />
      </main>
    );
  }
} 