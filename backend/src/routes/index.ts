import { Router } from 'express'
import organizacoesRouter from './organizacoes'
import empresasRouter from './empresas'
import sitesRouter from './sites'
import stakeholdersRouter from './stakeholders'
import membrosEquipeRouter from './membros-equipe'
import projetosRouter from './projetos'
import relatoriosRouter from './relatorios'
import descricoesRawRouter from './descricoes-raw'
import processosNormalizadosRouter from './processos-normalizados'
import ragRouter from './rag'

const router = Router()

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Rotas de cadastramento (User Story 1)
router.use('/clientes', clientesRouter)
router.use('/empresas', empresasRouter)
router.use('/sites', sitesRouter)
router.use('/stakeholders', stakeholdersRouter)
router.use('/membros-equipe', membrosEquipeRouter)
router.use('/projetos', projetosRouter)
router.use('/relatorios', relatoriosRouter)

// Rotas de processamento (User Story 2)
router.use('/descricoes-raw', descricoesRawRouter)
router.use('/processos-normalizados', processosNormalizadosRouter)

// Rotas de RAG (Regras Regulatórias)
router.use('/rag', ragRouter)

export default router

