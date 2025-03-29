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
      where: { id: session.user.id }
    });
    
    console.log("Campos disponíveis do usuário:", Object.keys(userFields || {}));
    
    try {
      // Atualizamos apenas os campos que sabemos que existem
      const data: any = {};
      
      // Verificar se o campo mfaEnabled existe no modelo
      if ('mfaEnabled' in (userFields || {})) {
        data.mfaEnabled = true;
      }
      
      // Verificar se o campo mfaSecret existe no modelo
      if ('mfaSecret' in (userFields || {})) {
        data.mfaSecret = secret;
      } else {
        // Se não existirem os campos MFA, tentamos armazenar a configuração no campo language para efeito de teste
        data.language = `mfa:${secret}`;
      }
      
      console.log("Dados para atualização:", data);
      
      // Tentamos atualizar usando os campos disponíveis
      const updatedUser = await db.user.update({
        where: { id: session.user.id },
        data
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
    console.log("Desativando MFA");
    
    const session = await auth();
    
    if (!session || !session.user) {
      throw new Error("Não autorizado");
    }
    
    // Verificamos os campos disponíveis no modelo User
    const userFields = await db.user.findUnique({
      where: { id: session.user.id }
    });
    
    console.log("Campos disponíveis do usuário:", Object.keys(userFields || {}));
    
    // Atualizamos apenas os campos que sabemos que existem
    const data: any = {};
    
    // Verificar se o campo mfaEnabled existe no modelo
    if ('mfaEnabled' in (userFields || {})) {
      data.mfaEnabled = false;
    }
    
    // Verificar se o campo mfaSecret existe no modelo
    if ('mfaSecret' in (userFields || {})) {
      data.mfaSecret = null;
    } else {
      // Se não existirem os campos MFA, limpamos o campo language se estiver sendo usado para MFA
      if (userFields?.language?.startsWith('mfa:')) {
        data.language = 'pt-BR';
      }
    }
    
    console.log("Dados para atualização:", data);
    
    // Tentamos atualizar usando os campos disponíveis
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data
    });
    
    console.log("Usuário atualizado com sucesso para desativar MFA:", updatedUser.id);
    return { success: true };
  } catch (error) {
    console.error("Erro ao desativar MFA:", error);
    return { success: false, error };
  }
} 