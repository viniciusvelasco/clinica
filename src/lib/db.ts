import { PrismaClient } from '@prisma/client';

// Exportar uma instância única do Prisma para uso em toda a aplicação
export const db = new PrismaClient(); 