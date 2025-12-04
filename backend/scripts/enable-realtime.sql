-- Script SQL para habilitar Realtime nas tabelas necessárias
-- Executar no Supabase SQL Editor

-- Habilitar Realtime para tabelas que precisam de atualizações em tempo real

-- Notificações de processamento IA
ALTER PUBLICATION supabase_realtime ADD TABLE chamadas_ia;

-- Updates de iniciativas (progresso, status)
ALTER PUBLICATION supabase_realtime ADD TABLE iniciativas;

-- Novas respostas de questionários
ALTER PUBLICATION supabase_realtime ADD TABLE respostas_questionario;

-- Status de processamento de processos normalizados
ALTER PUBLICATION supabase_realtime ADD TABLE processos_normalizados;

-- Updates de projetos (progresso geral)
ALTER PUBLICATION supabase_realtime ADD TABLE projetos;

-- Verificar tabelas habilitadas para Realtime
SELECT 
  schemaname,
  tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
ORDER BY tablename;



