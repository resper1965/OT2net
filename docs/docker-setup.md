# Configuração do Docker Compose

Este documento descreve como usar o Docker Compose para o ambiente de desenvolvimento do OT2net.

## Serviços Configurados

### Redis

Redis é usado para:
- **Cache**: Armazenamento temporário de dados
- **Bull/BullMQ**: Sistema de filas para jobs assíncronos (processamento IA, geração de relatórios, etc.)

## Requisitos

- Docker instalado
- Docker Compose instalado (geralmente vem com Docker Desktop)

## Uso

### Iniciar Redis

```bash
# Iniciar Redis em background
docker-compose up -d redis

# Ver logs
docker-compose logs -f redis

# Verificar status
docker-compose ps
```

### Parar Redis

```bash
# Parar Redis
docker-compose stop redis

# Parar e remover containers
docker-compose down

# Parar e remover containers + volumes (⚠️ apaga dados)
docker-compose down -v
```

### Acessar Redis CLI

```bash
# Conectar ao Redis CLI
docker-compose exec redis redis-cli

# Ou diretamente
docker exec -it ot2net-redis redis-cli
```

### Comandos Úteis do Redis

```bash
# Verificar se Redis está funcionando
PING
# Resposta: PONG

# Ver informações do servidor
INFO

# Ver todas as chaves
KEYS *

# Limpar todas as chaves (⚠️ cuidado!)
FLUSHALL

# Ver memória usada
INFO memory
```

## Configuração

### Porta

Redis está configurado para rodar na porta padrão `6379`.

Se precisar mudar a porta, edite `docker-compose.yml`:

```yaml
ports:
  - "6380:6379"  # Muda porta externa para 6380
```

E atualize `REDIS_URL` no `.env.local`:

```env
REDIS_URL=redis://localhost:6380
```

### Persistência

Redis está configurado com persistência via `--appendonly yes`, salvando dados em volume Docker.

**Volume**: `redis-data` (persistente mesmo após `docker-compose down`)

**Remover dados**: `docker-compose down -v`

## Integração com Backend

O backend Express usa Bull/BullMQ para processar jobs assíncronos. Exemplo:

```typescript
import Bull from 'bull';
import { REDIS_URL } from './config';

// Criar fila
const processamentoIAQueue = new Bull('processamento-ia', REDIS_URL);

// Adicionar job
await processamentoIAQueue.add('processar-descricao', {
  descricaoId: '123',
  projetoId: '456'
});

// Processar jobs
processamentoIAQueue.process('processar-descricao', async (job) => {
  // Lógica de processamento
});
```

## Troubleshooting

### Erro: "Cannot connect to Redis"

1. Verifique se Redis está rodando:
   ```bash
   docker-compose ps
   ```

2. Verifique os logs:
   ```bash
   docker-compose logs redis
   ```

3. Verifique se a porta está disponível:
   ```bash
   lsof -i :6379
   ```

### Erro: "Connection refused"

- Verifique se `REDIS_URL` no `.env.local` está correto:
  ```env
  REDIS_URL=redis://localhost:6379
  ```

### Redis não persiste dados

- Verifique se o volume está sendo criado:
  ```bash
  docker volume ls | grep redis-data
  ```

- Verifique se `--appendonly yes` está no comando (já está configurado)

## Produção

⚠️ **Atenção**: Esta configuração é para desenvolvimento local.

Para produção, considere:
- Redis gerenciado (AWS ElastiCache, Redis Cloud, etc.)
- Configuração de senha
- SSL/TLS
- Backup automático
- Monitoramento

## Referências

- [Redis Docker Hub](https://hub.docker.com/_/redis)
- [Bull Documentation](https://github.com/OptimalBits/bull)
- [BullMQ Documentation](https://docs.bullmq.io/)

