import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { NextRequest } from "next/server"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string | null | undefined) {
  if (!name) return "U"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

export function getClientInfo(req: NextRequest) {
  // Obter IP
  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             '127.0.0.1'
  
  // Obter user-agent para identificar o navegador
  const userAgent = req.headers.get('user-agent') || ''
  
  // Identificar navegador de forma simplificada
  let browser = 'Desconhecido'
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    browser = `Chrome ${extractVersion(userAgent, 'Chrome')}`
  } else if (userAgent.includes('Firefox')) {
    browser = `Firefox ${extractVersion(userAgent, 'Firefox')}`
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = `Safari ${extractVersion(userAgent, 'Safari')}`
  } else if (userAgent.includes('Edg')) {
    browser = `Edge ${extractVersion(userAgent, 'Edg')}`
  } else if (userAgent.includes('OPR') || userAgent.includes('Opera')) {
    browser = `Opera ${extractVersion(userAgent, 'OPR')}`
  }
  
  // Na vida real você usaria um serviço de geolocalização como MaxMind
  // Aqui estamos apenas simulando a localização
  const local = 'São Paulo, SP' // Em produção, determine isso com base no IP
  
  return {
    ip,
    browser,
    local
  }
}

function extractVersion(userAgent: string, browser: string): string {
  const regex = new RegExp(`${browser}\\/([\\d.]+)`, 'i')
  const matches = userAgent.match(regex) || userAgent.match(new RegExp(`${browser}[/ ](\\d+(\\.\\d+)*)`, 'i'))
  return matches ? matches[1] : ''
}
