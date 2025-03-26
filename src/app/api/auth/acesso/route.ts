import { NextRequest, NextResponse } from "next/server";
import { getClientInfo } from "@/lib/utils";

// Armazenamento temporário para histórico de acesso (em produção usaríamos o banco de dados)
let historicoAcessoTemporario: any[] = [
  {
    id: "1",
    userId: "user-1",
    dataHora: new Date("2023-05-15T14:30:00Z").toISOString(), // Note o 'Z' para UTC
    ip: "192.168.1.1",
    browser: "Chrome 112.0.5615.138",
    local: "São Paulo, SP"
  },
  {
    id: "2",
    userId: "user-1",
    dataHora: new Date("2023-05-14T09:15:00Z").toISOString(),
    ip: "192.168.1.1",
    browser: "Chrome 112.0.5615.138",
    local: "São Paulo, SP"
  },
  {
    id: "3",
    userId: "user-1",
    dataHora: new Date("2023-05-13T18:45:00Z").toISOString(),
    ip: "200.145.12.98",
    browser: "Firefox 112.0",
    local: "Rio de Janeiro, RJ"
  }
];

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: "ID do usuário não fornecido" },
        { status: 400 }
      );
    }

    const clientInfo = getClientInfo(req);
    
    // Criar novo registro
    const novoAcesso = {
      id: `temp-${Date.now()}`,
      userId,
      dataHora: new Date().toISOString(), // UTC-0
      ip: clientInfo.ip || "Desconhecido",
      browser: clientInfo.browser || "Desconhecido",
      local: clientInfo.local || "Desconhecido",
    };
    
    // Adicionar ao array temporário
    historicoAcessoTemporario.unshift(novoAcesso);
    
    return NextResponse.json({ success: true, acesso: novoAcesso });
  } catch (error) {
    console.error("Erro ao registrar acesso:", error);
    return NextResponse.json(
      { error: "Erro ao registrar acesso" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json(
        { error: "ID do usuário não fornecido" },
        { status: 400 }
      );
    }

    // Filtrar e retornar os registros do usuário
    const historico = historicoAcessoTemporario
      .filter(acesso => acesso.userId === userId)
      .slice(0, 10); // Limitar a 10 últimos acessos

    return NextResponse.json({ historico });
  } catch (error) {
    console.error("Erro ao buscar histórico de acesso:", error);
    return NextResponse.json(
      { error: "Erro ao buscar histórico de acesso" },
      { status: 500 }
    );
  }
} 