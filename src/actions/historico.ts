"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function buscarHistoricoAcesso() {
  try {
    // Verificar se o usuário está autenticado
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }
    
    // Buscar histórico de acessos do usuário
    const historico = await db.historicoAcesso.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        dataHora: "desc",
      },
      take: 10, // Limitar aos 10 acessos mais recentes
    });
    
    return { historico };
  } catch (error) {
    console.error("Erro ao buscar histórico de acessos:", error);
    throw new Error("Falha ao buscar histórico de acessos");
  }
} 