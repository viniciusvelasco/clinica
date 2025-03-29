'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

/**
 * Atualiza o idioma do usuário no banco de dados
 */
export async function updateUserLanguage(language: string) {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      throw new Error("Não autorizado");
    }
    
    await db.user.update({
      where: { id: session.user.id },
      data: { language }
    });
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar idioma:", error);
    return { success: false, error };
  }
}

/**
 * Obtém o idioma do usuário do banco de dados
 */
export async function getUserLanguage() {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      throw new Error("Não autorizado");
    }
    
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { language: true }
    });
    
    return { success: true, language: user?.language || 'pt-BR' };
  } catch (error) {
    console.error("Erro ao obter idioma:", error);
    return { success: false, error, language: 'pt-BR' };
  }
}

/**
 * Ativa o MFA para um usuário
 */
export async function enableMfa(secret: string) {
  try {
    console.log("Ativando MFA com segredo:", secret);
    
    const session = await auth();
    console.log("Sessão:", session);
    
    if (!session || !session.user) {
      console.error("Sessão inválida ou usuário não autenticado");
      throw new Error("Não autorizado");
    }
    
    console.log("ID do usuário:", session.user.id);
    
    // Verificamos os campos disponíveis no modelo User
    const userFields = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true }
    });
    
    console.log("Campos disponíveis:", userFields);
    
    try {
      // Tentamos atualizar usando os campos normais
      const updatedUser = await db.user.update({
        where: { id: session.user.id },
        data: { 
          mfaEnabled: true,
          mfaSecret: secret
        }
      });
      
      console.log("Usuário atualizado com sucesso:", updatedUser.id);
      return { success: true };
    } catch (updateError) {
      console.error("Erro na atualização:", updateError);
      throw updateError;
    }
  } catch (error) {
    console.error("Erro ao ativar MFA:", error);
    
    // Logar detalhes adicionais do erro
    if (error instanceof Error) {
      console.error("Nome do erro:", error.name);
      console.error("Mensagem do erro:", error.message);
      console.error("Stack trace:", error.stack);
    }
    
    return { 
      success: false, 
      error,
      message: error instanceof Error ? error.message : "Erro desconhecido" 
    };
  }
}

/**
 * Desativa o MFA para um usuário
 */
export async function disableMfa() {
  try {
    const session = await auth();
    
    if (!session || !session.user) {
      throw new Error("Não autorizado");
    }
    
    await db.user.update({
      where: { id: session.user.id },
      data: { 
        mfaSecret: null,
        mfaEnabled: false
      }
    });
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao desativar MFA:", error);
    return { success: false, error };
  }
} 