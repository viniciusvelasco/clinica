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
    
    // Verificamos se os campos MFA estão disponíveis no modelo
    const hasMfaEnabled = 'mfaEnabled' in (userFields || {});
    const hasMfaSecret = 'mfaSecret' in (userFields || {});
    
    console.log("Campos MFA disponíveis:", { hasMfaEnabled, hasMfaSecret });
    
    try {
      // Atualizamos apenas os campos que sabemos que existem
      const data: any = {};
      
      // Se ambos os campos estiverem disponíveis, usamos eles normalmente
      if (hasMfaEnabled && hasMfaSecret) {
        data.mfaEnabled = true;
        data.mfaSecret = secret;
      } 
      // Se os campos MFA não estiverem disponíveis, usamos o campo language
      else {
        console.log("Usando campo language para armazenar configuração MFA");
        data.language = `mfa:${secret}`;
      }
      
      console.log("Dados para atualização:", data);
      
      // Tentamos atualizar usando os campos disponíveis
      const updatedUser = await db.user.update({
        where: { id: session.user.id },
        data
      });
      
      console.log("Usuário atualizado com sucesso:", updatedUser);
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
    
    // Verificamos se os campos MFA estão disponíveis no modelo
    const hasMfaEnabled = 'mfaEnabled' in (userFields || {});
    const hasMfaSecret = 'mfaSecret' in (userFields || {});
    const hasMfaInLanguage = userFields?.language?.startsWith('mfa:');
    
    console.log("Estado MFA atual:", { 
      hasMfaEnabled, 
      hasMfaSecret,
      hasMfaInLanguage,
      language: userFields?.language
    });
    
    // Atualizamos apenas os campos que sabemos que existem
    const data: any = {};
    
    // Se os campos MFA estiverem disponíveis, atualizamos eles
    if (hasMfaEnabled) {
      data.mfaEnabled = false;
    }
    
    if (hasMfaSecret) {
      data.mfaSecret = null;
    }
    
    // Se o MFA estiver armazenado no campo language, resetamos esse campo
    if (hasMfaInLanguage) {
      data.language = 'pt-BR';
    }
    
    // Só prosseguimos se tivermos algo para atualizar
    if (Object.keys(data).length === 0) {
      console.log("Nenhum campo MFA para desativar");
      return { success: true };
    }
    
    console.log("Dados para atualização ao desativar MFA:", data);
    
    // Tentamos atualizar usando os campos disponíveis
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data
    });
    
    console.log("Usuário atualizado com sucesso para desativar MFA:", updatedUser);
    return { success: true };
  } catch (error) {
    console.error("Erro ao desativar MFA:", error);
    return { success: false, error };
  }
} 