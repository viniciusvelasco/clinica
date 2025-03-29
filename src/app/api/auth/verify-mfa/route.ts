import { NextResponse } from "next/server";
import { verifyMfaCode } from "@/actions/user";
import { authenticator } from 'otplib';
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, secret, code } = body;
    
    if (!userId || !secret || !code) {
      return NextResponse.json(
        { success: false, message: "Dados incompletos" },
        { status: 400 }
      );
    }
    
    // Verificar que o usuário existe
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, mfaEnabled: true, mfaSecret: true }
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Usuário não encontrado" },
        { status: 404 }
      );
    }
    
    // Verificar se o secret fornecido corresponde ao do usuário
    if (user.mfaSecret !== secret) {
      return NextResponse.json(
        { success: false, message: "Dados de autenticação inválidos" },
        { status: 400 }
      );
    }
    
    // Verificar o código
    const isValid = authenticator.verify({
      token: code,
      secret
    });
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Código inválido ou expirado" },
        { status: 400 }
      );
    }
    
    // Código válido, retornar sucesso
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro na verificação MFA:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao processar a verificação" },
      { status: 500 }
    );
  }
} 