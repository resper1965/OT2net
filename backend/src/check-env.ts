import dotenv from 'dotenv';
import path from 'path';

// Carregar variáveis de ambiente da mesma forma que o server.ts
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

console.log('Checking environment variables...');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Present' : 'Missing');
if (process.env.DATABASE_URL) {
  const protocol = process.env.DATABASE_URL.split(':')[0];
  console.log('DATABASE_URL Protocol:', protocol);
}



if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is missing!');
}
