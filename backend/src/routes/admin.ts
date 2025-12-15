import { Router } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import { authenticateToken } from '../middleware/auth';

const execAsync = promisify(exec);
const router = Router();

// POST /api/admin/migrate - Executar migração do banco
router.post('/migrate', authenticateToken, async (req: any, res, next) => {
  try {
    console.log('Iniciando migração do banco de dados...');
    
    const { stdout, stderr } = await execAsync('npx prisma db push --accept-data-loss', {
      cwd: process.cwd(),
      timeout: 60000, // 60 segundos
    });

    console.log('Migração concluída:', stdout);
    if (stderr) console.error('Avisos:', stderr);

    res.json({
      success: true,
      message: 'Migração executada com sucesso',
      output: stdout,
      warnings: stderr || null,
    });
  } catch (error: any) {
    console.error('Erro na migração:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao executar migração',
      error: error.message,
      output: error.stdout,
      stderr: error.stderr,
    });
  }
});

// POST /api/admin/seed - Executar seed das fases
router.post('/seed-fases', authenticateToken, async (req: any, res, next) => {
  try {
    console.log('Iniciando seed das fases...');
    
    const { stdout, stderr } = await execAsync('npx ts-node prisma/seed-fases.ts', {
      cwd: process.cwd(),
      timeout: 30000, // 30 segundos
    });

    console.log('Seed concluído:', stdout);
    if (stderr) console.error('Avisos:', stderr);

    res.json({
      success: true,
      message: 'Seed executado com sucesso',
      output: stdout,
      warnings: stderr || null,
    });
  } catch (error: any) {
    console.error('Erro no seed:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao executar seed',
      error: error.message,
      output: error.stdout,
      stderr: error.stderr,
    });
  }
});

export default router;
