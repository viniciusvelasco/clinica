import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Dados incompletos" },
        { status: 400 }
      );
    }
    
    // Verificar que o usuário existe
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Usuário não encontrado" },
        { status: 404 }
      );
    }
    
    // Extrair informações do navegador e IP de forma segura
    let ip = "Desconhecido";
    let browser = "Desconhecido";
    
    if (request.headers) {
      browser = request.headers.get("user-agent") || "Desconhecido";
      const forwarded = request.headers.get("x-forwarded-for") || "";
      const realIp = request.headers.get("x-real-ip") || "";
      
      ip = forwarded ? forwarded.split(",")[0].trim() : 
           realIp ? realIp : "Desconhecido";
    }
    
    // Registrar histórico de acesso
    await db.historicoAcesso.create({
      data: {
        userId,
        dataHora: new Date(),
        ip,
        browser,
        local: "Brasil"
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao registrar acesso:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao registrar acesso" },
      { status: 500 }
    );
  }
} 