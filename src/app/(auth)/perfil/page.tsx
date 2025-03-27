// Server Component - página de perfil
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { PerfilForm } from "@/components/perfil/perfil-form";

export default async function PerfilPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }
  
  // Carregar histórico de acesso no servidor diretamente do DB
  try {
    const historico = await db.historicoAcesso.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        dataHora: "desc",
      },
      take: 10, // Limitar aos 10 acessos mais recentes
    });
    
    return <PerfilForm user={session.user} historico={historico} />;
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    
    return <PerfilForm user={session.user} historico={[]} />;
  }
} 