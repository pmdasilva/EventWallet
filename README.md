# Event Wallet

Aplicação de estudo desenvolvida para explorar conceitos de arquitetura de software utilizando **Event Sourcing**, **DDD (Domain-Driven Design)** e **CQRS (em evolução)**.

O projeto demonstra como reconstruir o estado de uma entidade a partir de eventos de domínio persistidos em um Event Store, em vez de armazenar apenas o estado atual.

## Sumário

- [Demonstração](#demonstração)
- [Objetivo](#-objetivo)
- [Arquitetura](#-arquitetura)
- [ADRs e arquitetura](#adrs-e-arquitetura)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades-implementadas)
- [API](#-api)
- [Interface web](#-interface-web)
- [Event Store](#-event-store)
- [Executando o projeto](#-executando-o-projeto)
- [Testes](#-testes)
- [Roadmap](#-roadmap)
- [Conceitos explorados](#-conceitos-explorados)

## Demonstração

### Frontend

https://event-wallet-tau.vercel.app

### Backend

https://eventwallet-production.up.railway.app

### Health Check

https://eventwallet-production.up.railway.app/health

## 🎯 Objetivo

Diferente de uma aplicação CRUD tradicional, este projeto utiliza o padrão **Event Sourcing**, onde todas as alterações de estado são persistidas como eventos imutáveis.

Em vez de armazenar apenas o saldo atual de uma carteira, o sistema registra toda a sua linha do tempo:

```text
WalletCreated
MoneyDeposited
MoneyWithdrawn
```

O estado atual da carteira é reconstruído pela reidratação do agregado `WalletAggregate`. A partir dos eventos persistidos também é possível calcular o saldo em uma data/hora anterior.

Fluxo simplificado:

```text
WalletCreatedEvent
        ↓
MoneyDepositedEvent
        ↓
MoneyWithdrawnEvent
        ↓
Replay dos eventos
        ↓
Estado atual da carteira
```

## 🏛 Arquitetura

Em produção, o frontend React publicado na Vercel consome a API Fastify no Railway, que persiste os eventos no MongoDB:

```text
React (Vercel)
        ↓
Fastify API (Railway)
        ↓
MongoDB (Railway)
```

O backend segue uma arquitetura em camadas para manter a separação de responsabilidades:

```text
wallet-event-sourcing/
├── src/
│   ├── application/
│   │   ├── commands/
│   │   ├── handlers/
│   │   └── services/
│   ├── domain/
│   │   ├── aggregates/
│   │   ├── events/
│   │   └── repositories/
│   ├── infrastructure/
│   │   ├── database/
│   │   └── event-store/
│   ├── main/
│   ├── presentation/
│   │   ├── routes/
│   │   ├── dtos/
│   │   └── schemas/
│   └── shared/
└── tests/

wallet-frontend/
└── src/
    ├── App.tsx
    ├── api.ts
    ├── index.css
    └── main.tsx
```

### Camadas

- **Domain**: agregado da carteira, eventos de domínio e contratos de persistência.
- **Application**: comandos, handlers e serviços de reidratação e consulta.
- **Infrastructure**: conexão com MongoDB e implementação do Event Store.
- **Presentation**: rotas HTTP, schemas Zod e validação de entrada.
- **Main**: inicialização da API Fastify.
- **Frontend**: interface React para operar a API e consultar a timeline.

## ADRs e arquitetura

As decisões arquiteturais do projeto são registradas como Architecture Decision Records em [`docs/adr/`](docs/adr/README.md). Consulte também a [visão geral da arquitetura](docs/architecture/overview.md), que apresenta diagramas Mermaid do estado atual e da proposta de evolução para CQRS. O template e as convenções para novos registros estão disponíveis no diretório de ADRs; a skill [`adr-documentation`](.github/skills/adr-documentation/SKILL.md) orienta o Copilot a criá-los e revisá-los.

---

## 🛠 Tecnologias

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Backend

- Node.js
- TypeScript
- Fastify
- MongoDB
- Zod

### Infraestrutura

- Railway
- Vercel
- GitHub
- Docker Compose para desenvolvimento local

### Conceitos

- Event Sourcing
- Domain Events
- Aggregate Root
- Event Replay
- Domain-Driven Design (DDD)
- Separation of Concerns
- REST API
- Repository Pattern
- CQRS em evolução

---

## 📦 Event Store

Os eventos são armazenados no banco `walletdb`, na coleção `wallet_events`.

```text
wallet_events
```

Estrutura de um documento persistido:

```json
{
  "aggregateId": "5d84cb8b-72f1-4a9e-b1d7-a96ef47b24fd",
  "eventType": "MoneyDepositedEvent",
  "occurredAt": "2026-01-10T10:00:00.000Z",
  "version": 1,
  "payload": {
    "amount": 100
  }
}
```

---

## ✅ Funcionalidades Implementadas

### História 1 - Estrutura Inicial

- [x] Criação da solução Node.js + TypeScript
- [x] Configuração do Fastify
- [x] Endpoint Health Check
- [x] Configuração do Docker
- [x] Configuração do MongoDB
- [x] Estruturação da arquitetura do projeto

### História 2 - Event Store

- [x] Conexão com MongoDB
- [x] Classe base `DomainEvent`
- [x] Contrato `EventStore`
- [x] Implementação `MongoEventStore`
- [x] Persistência de eventos
- [x] Recuperação de eventos por aggregate

### Carteira e operações

- [x] Criação de carteira com nome do proprietário
- [x] Geração de `walletId` com UUID
- [x] Consulta do estado atual da carteira
- [x] Reconstrução do estado via replay dos eventos
- [x] Depósito de valores positivos
- [x] Saque com validação de saldo suficiente
- [x] Consulta da timeline de eventos
- [x] Consulta do saldo em uma data/hora ISO 8601
- [x] Persistência do último `walletId` no navegador
- [x] Painel React para criar e consultar carteiras

---

## 🌐 API

Base URL de produção: `https://eventwallet-production.up.railway.app`

Base URL local: `http://localhost:3000`

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/health` | Health check da API |
| `POST` | `/test-event` | Persiste um evento de teste |
| `POST` | `/wallets` | Cria uma carteira |
| `GET` | `/wallets/:walletId` | Consulta o estado atual |
| `POST` | `/wallets/:walletId/deposit` | Registra um depósito |
| `POST` | `/wallets/:walletId/withdraw` | Registra um saque |
| `GET` | `/wallets/:walletId/events` | Lista os eventos da carteira |
| `GET` | `/wallets/:walletId/balance-at?date=...` | Consulta o saldo em uma data/hora |

### Exemplos

Criar carteira:

```bash
curl -X POST http://localhost:3000/wallets \
  -H "Content-Type: application/json" \
  -d '{"ownerName":"Maria Silva"}'
```

Resposta:

```json
{
  "walletId": "5d84cb8b-72f1-4a9e-b1d7-a96ef47b24fd"
}
```

Depositar:

```bash
curl -X POST http://localhost:3000/wallets/5d84cb8b-72f1-4a9e-b1d7-a96ef47b24fd/deposit \
  -H "Content-Type: application/json" \
  -d '{"amount":150}'
```

Sacar:

```bash
curl -X POST http://localhost:3000/wallets/5d84cb8b-72f1-4a9e-b1d7-a96ef47b24fd/withdraw \
  -H "Content-Type: application/json" \
  -d '{"amount":40}'
```

Consultar estado, eventos e saldo histórico:

```bash
curl http://localhost:3000/wallets/5d84cb8b-72f1-4a9e-b1d7-a96ef47b24fd
curl http://localhost:3000/wallets/5d84cb8b-72f1-4a9e-b1d7-a96ef47b24fd/events
curl "http://localhost:3000/wallets/5d84cb8b-72f1-4a9e-b1d7-a96ef47b24fd/balance-at?date=2026-01-10T10%3A30%3A00.000Z"
```

### Validações

- `ownerName` deve possuir pelo menos 3 caracteres.
- `amount` deve ser um número positivo.
- O saque não pode ultrapassar o saldo atual.
- `date` deve ser uma data/hora válida no formato ISO 8601 com offset.
- Depósitos e saques retornam `204` quando registrados com sucesso.

---

## 🚀 Executando o Projeto

### Pré-requisitos

- Node.js
- Docker e Docker Compose
- npm

### 1. Instalar dependências

Na raiz do repositório:

```bash
cd wallet-event-sourcing
npm install

cd ../wallet-frontend
npm install
```

### 2. Configurar variáveis de ambiente

Crie `wallet-event-sourcing/.env`:

```env
PORT=3000
MONGO_URI=mongodb://admin:admin@localhost:27017/?authSource=admin
```

Não mantenha credenciais reais nesse arquivo quando compartilha o repositório; use configurações locais ou variáveis de ambiente do ambiente de execução.

### 3. Subir MongoDB

```bash
docker compose up -d
```

Para verificar o container:

```bash
docker compose ps
```

Para encerrar:

```bash
docker compose down
```

### 4. Executar a API

```bash
cd wallet-event-sourcing
npm run dev
```

No modo desenvolvimento, a API estará disponível em `http://localhost:3000`.

### 5. Executar o painel frontend

Em outro terminal, a partir da raiz do repositório, instale e inicie o painel:

```bash
cd wallet-frontend
npm run dev
```

O painel ficará disponível em `http://localhost:5173` e encaminha as chamadas `/api` para a API em `http://localhost:3000`. Mantenha a API e o MongoDB em execução. No painel, crie uma carteira ou informe um `walletId` existente para consultar o saldo, registrar operações e visualizar a timeline.

Para apontar o frontend para outra API, configure `VITE_API_BASE_URL` em `wallet-frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Em produção, configure a variável `VITE_API_BASE_URL` nas variáveis de ambiente do projeto frontend na Vercel:

```env
VITE_API_BASE_URL=https://eventwallet-production.up.railway.app
```

Após alterar essa variável na Vercel, faça um novo deploy do frontend. O proxy do Vite para `/api` é usado por padrão durante o desenvolvimento local.

### Deploy

- **Vercel:** publique o frontend usando `wallet-frontend` como diretório raiz, `npm run build` como comando de build e `dist` como diretório de saída.
- **Railway:** publique a API usando `wallet-event-sourcing` como diretório raiz. Execute `npm run build` no build e `node dist/main/server.js` para iniciar a aplicação.
- Configure as variáveis de ambiente da API, incluindo `PORT` e `MONGO_URI`, no Railway. Não coloque credenciais no README ou no repositório.

### Scripts disponíveis

Backend:

```bash
npm run dev    # desenvolvimento com watch
npm run build  # compilação TypeScript para dist/
npm start      # executa a compilação existente
npm test       # testes do domínio e da rota de saldo histórico
```

Frontend:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

---

## 🖥 Interface web

O painel permite:

- criar uma carteira informando o nome do proprietário;
- carregar uma carteira pelo UUID;
- consultar o saldo atual;
- registrar depósitos e saques;
- visualizar os eventos mais recentes primeiro;
- consultar o saldo em uma data/hora específica;
- manter o último `walletId` selecionado no `localStorage` do navegador.

---

## 🧪 Testes

Os testes atuais cobrem o cálculo do saldo histórico e a validação HTTP da consulta por data.

Na raiz do repositório:

```bash
cd wallet-event-sourcing
npm test
```

Os arquivos estão em `wallet-event-sourcing/tests/`.

---

## ❤️ Roadmap

### MVP

- [x] Estrutura inicial
- [x] Event Store MongoDB
- [x] Wallet Aggregate
- [x] WalletCreated Event
- [x] Criar carteira
- [x] Depositar valor
- [x] Sacar valor
- [x] Consultar saldo
- [x] Histórico de eventos
- [x] Consulta de saldo em data/hora
- [x] Painel web básico
- [x] Deploy em produção

### Próximos Passos

- [ ] Evoluir CQRS com read models e projections
- [ ] Transferências entre carteiras
- [ ] Read models dedicados
- [ ] Projections
- [ ] Controle de concorrência e versão esperada
- [ ] Idempotência das operações
- [ ] Persistência do event version por agregado
- [ ] Snapshots
- [ ] RabbitMQ
- [ ] Ampliar testes automatizados e adicionar testes de integração
- [ ] Observabilidade e logs
- [ ] Event versioning

---

## 📚 Conceitos Explorados

- Event Sourcing
- Domain Driven Design (DDD)
- CQRS
- Aggregate Root
- Event Store
- Event Replay
- Read Models
- Arquitetura Orientada a Eventos

---

## 👨‍💻 Autor

Projeto desenvolvido para estudos avançados de arquitetura de software e demonstração de conhecimento em Event Sourcing utilizando Node.js e TypeScript.
