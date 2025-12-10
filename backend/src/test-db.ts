import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Carregar variáveis de ambiente
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Connecting to database...');
    const clientes = await prisma.cliente.findMany({
      take: 1,
    });
    console.log('Successfully connected!');
    console.log('Clientes found:', clientes.length);
    console.log('First cliente:', clientes[0]);
  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
