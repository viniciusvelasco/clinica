import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ 
        error: "Não autorizado", 
        authenticated: false 
      }, { status: 401 });
    }
    
    // Obter informações do usuário atual
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        mfaEnabled: true,
        mfaSecret: true,
        language: true
      }
    });
    
    if (!user) {
      return NextResponse.json({ 
        error: "Usuário não encontrado", 
        userId: session.user.id 
      }, { status: 404 });
    }
    
    return NextResponse.json({
      message: "Informações do usuário obtidas com sucesso",
      user: {
        id: user.id,
        email: user.email,
        mfaEnabled: user.mfaEnabled,
        hasMfaSecret: !!user.mfaSecret,
        language: user.language
      }
    });
  } catch (error) {
    console.error("Erro ao testar DB:", error);
    
    return NextResponse.json({
      error: "Erro ao acessar o banco de dados",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await auth();
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ 
        error: "Não autorizado", 
        authenticated: false 
      }, { status: 401 });
    }
    
    // Gerar um segredo de teste
    const testSecret = "TESTEABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    
    try {
      // Tentar atualizar o MFA diretamente
      const updatedUser = await db.user.update({
        where: { id: session.user.id },
        data: { 
          mfaEnabled: true,
          mfaSecret: testSecret
        },
        select: {
          id: true,
          email: true,
          mfaEnabled: true,
          mfaSecret: true
        }
      });
      
      return NextResponse.json({
        message: "MFA atualizado com sucesso",
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          mfaEnabled: updatedUser.mfaEnabled,
          hasMfaSecret: !!updatedUser.mfaSecret
        }
      });
    } catch (updateError) {
      return NextResponse.json({
        error: "Erro ao atualizar MFA",
        details: updateError instanceof Error ? updateError.message : String(updateError),
        name: updateError instanceof Error ? updateError.name : "UnknownError",
        stack: updateError instanceof Error ? updateError.stack : undefined
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error("Erro ao testar atualização de MFA:", error);
    
    return NextResponse.json({
      error: "Erro ao acessar o banco de dados",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 