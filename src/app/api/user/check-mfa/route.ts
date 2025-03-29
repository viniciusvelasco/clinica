import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    // Verificar se o usuário está autenticado
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    
    // Garantir que o usuário só pode verificar seus próprios dados
    if (session.user.id !== userId) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }
    
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        mfaEnabled: true,
        mfaSecret: true
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({
      id: user.id,
      email: user.email,
      mfaEnabled: user.mfaEnabled,
      mfaSecret: user.mfaSecret
    });
  } catch (error) {
    console.error('Erro ao verificar MFA:', error);
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    );
  }
} 