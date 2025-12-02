import { Router } from 'express'

const router = Router()

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Rotas serão adicionadas aqui
// router.use('/projetos', projetosRouter)
// router.use('/clientes', clientesRouter)
// router.use('/usuarios', usuariosRouter)

export default router

