'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

// Função para atualizar o idioma preferido do usuário
export async function updateUserLanguage(language: string) {
  try {
    const session = await auth();
    
    // Verificar se o usuário está autenticado
    if (!session?.user?.id) {
      return { error: 'Não autorizado' };
    }
    
    // Atualizar o campo language no perfil do usuário
    await db.user.update({
      where: { id: session.user.id },
      data: { language }
    });
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar idioma do usuário:', error);
    return { error: 'Falha ao atualizar o idioma' };
  }
}

// Função para obter o idioma preferido do usuário
export async function getUserLanguage() {
  try {
    const session = await auth();
    
    // Verificar se o usuário está autenticado
    if (!session?.user?.id) {
      return { language: null };
    }
    
    // Buscar o idioma do usuário
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { language: true }
    });
    
    return { language: user?.language || null };
  } catch (error) {
    console.error('Erro ao obter idioma do usuário:', error);
    return { language: null };
  }
} 