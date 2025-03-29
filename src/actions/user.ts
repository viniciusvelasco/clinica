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
    console.log("Iniciando ativação MFA com segredo:", secret);
    
    const session = await auth();
    console.log("Sessão:", session?.user?.id);
    
    if (!session || !session.user) {
      console.error("Tentativa de ativar MFA sem autenticação");
      throw new Error("Não autorizado");
    }
    
    const userId = session.user.id;
    console.log("ID do usuário para atualização:", userId);
    
    // Abordagem simples para atualizar o MFA
    try {
      // Usar o Prisma Client diretamente com update
      const result = await db.user.update({
        where: { 
          id: userId 
        },
        data: { 
          mfaEnabled: true,
          mfaSecret: secret
        },
        select: {
          id: true,
          mfaEnabled: true,
          mfaSecret: true
        }
      });
      
      console.log("Atualização MFA bem-sucedida:", {
        id: result.id,
        mfaEnabled: result.mfaEnabled,
        hasMfaSecret: !!result.mfaSecret
      });
      
      return { success: true };
    } catch (updateError) {
      console.error("Erro específico na atualização do MFA:", updateError);
      
      // Log de detalhes adicionais do erro
      if (updateError instanceof Error) {
        console.error("Nome:", updateError.name);
        console.error("Mensagem:", updateError.message);
        console.error("Stack:", updateError.stack);
      }
      
      return { 
        success: false, 
        error: updateError,
        message: updateError instanceof Error 
          ? updateError.message 
          : "Erro desconhecido na atualização do MFA"
      };
    }
  } catch (error) {
    console.error("Erro geral ao ativar MFA:", error);
    
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
    console.log("Iniciando desativação MFA");
    
    const session = await auth();
    console.log("Sessão:", session?.user?.id);
    
    if (!session || !session.user) {
      console.error("Tentativa de desativar MFA sem autenticação");
      throw new Error("Não autorizado");
    }
    
    const userId = session.user.id;
    console.log("ID do usuário para atualização:", userId);
    
    // Abordagem simples para desativar o MFA
    try {
      // Usar o Prisma Client diretamente com update
      const result = await db.user.update({
        where: { 
          id: userId 
        },
        data: { 
          mfaEnabled: false,
          mfaSecret: null
        },
        select: {
          id: true,
          mfaEnabled: true,
          mfaSecret: true
        }
      });
      
      console.log("Desativação MFA bem-sucedida:", {
        id: result.id,
        mfaEnabled: result.mfaEnabled,
        hasMfaSecret: !!result.mfaSecret
      });
      
      return { success: true };
    } catch (updateError) {
      console.error("Erro específico na desativação do MFA:", updateError);
      
      // Log de detalhes adicionais do erro
      if (updateError instanceof Error) {
        console.error("Nome:", updateError.name);
        console.error("Mensagem:", updateError.message);
        console.error("Stack:", updateError.stack);
      }
      
      return { 
        success: false, 
        error: updateError,
        message: updateError instanceof Error 
          ? updateError.message 
          : "Erro desconhecido na desativação do MFA"
      };
    }
  } catch (error) {
    console.error("Erro geral ao desativar MFA:", error);
    
    return { 
      success: false, 
      error,
      message: error instanceof Error ? error.message : "Erro desconhecido" 
    };
  }
} 