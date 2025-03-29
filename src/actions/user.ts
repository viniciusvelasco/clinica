'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

// Função para atualizar o idioma do usuário
export async function updateUserLanguage(language: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado");
    }
    
    // Atualizar o idioma no banco de dados
    await db.user.update({
      where: { id: session.user.id },
      data: { language },
    });
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar idioma:", error);
    return { success: false, error: "Erro ao atualizar idioma" };
  }
}

// Função para buscar o idioma do usuário
export async function getUserLanguage() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { language: null };
    }
    
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { language: true },
    });
    
    return { language: user?.language || null };
  } catch (error) {
    console.error("Erro ao buscar idioma:", error);
    return { language: null };
  }
} 