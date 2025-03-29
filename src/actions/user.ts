'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { authenticator } from 'otplib';

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
    const session = await auth();
    
    if (!session || !session.user) {
      throw new Error("Não autorizado");
    }
    
    const userId = session.user.id;
    
    // Atualizar o MFA
    try {
      await db.user.update({
        where: { id: userId },
        data: { 
          mfaEnabled: true,
          mfaSecret: secret
        }
      });
      
      return { success: true };
    } catch (updateError) {
      return { 
        success: false, 
        error: updateError,
        message: updateError instanceof Error 
          ? updateError.message 
          : "Erro desconhecido na atualização do MFA"
      };
    }
  } catch (error) {
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
    
    const userId = session.user.id;
    
    // Desativar o MFA
    try {
      await db.user.update({
        where: { id: userId },
        data: { 
          mfaEnabled: false,
          mfaSecret: null
        }
      });
      
      return { success: true };
    } catch (updateError) {
      return { 
        success: false, 
        error: updateError,
        message: updateError instanceof Error 
          ? updateError.message 
          : "Erro desconhecido na desativação do MFA"
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error,
      message: error instanceof Error ? error.message : "Erro desconhecido" 
    };
  }
}

/**
 * Verifica um código MFA para um determinado usuário e segredo
 */
export async function verifyMfaCode(userId: string, secret: string, code: string) {
  try {
    // Verificar se o código tem 6 dígitos
    if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
      return { 
        success: false, 
        message: "Código inválido" 
      };
    }
    
    // Usar a biblioteca otplib para verificar o código TOTP
    try {
      const isValid = authenticator.verify({ 
        token: code, 
        secret: secret 
      });
      
      if (!isValid) {
        return { 
          success: false, 
          message: "Código inválido ou expirado" 
        };
      }
      
      return { success: true };
    } catch (verifyError) {
      return { 
        success: false, 
        message: "Erro na verificação do código"
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error,
      message: error instanceof Error ? error.message : "Erro ao verificar código MFA"
    };
  }
} 