# EventWallet

Aplicação de estudo baseada em Event Sourcing para criação e movimentação de carteiras digitais.

# Wallet Event Sourcing

Uma API e um painel web desenvolvidos com **Node.js**, **TypeScript**, **Fastify**, **MongoDB**, **React** e **Event Sourcing**. O projeto explora conceitos como **CQRS**, **DDD**, **Event Store**, **auditoria de eventos**, **reidratação de agregados** e **consulta de estado histórico**.

## Sumário

- [Objetivo](#-objetivo)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades-implementadas)
- [API](#-api)
- [Interface web](#-interface-web)
- [Event Store](#-event-store)
- [Executando o projeto](#-executando-o-projeto)
- [Testes](#-testes)
- [Roadmap](#-roadmap)
- [Conceitos explorados](#-conceitos-explorados)

## 🎯 Objetivo

Diferente de uma aplicação CRUD tradicional, este projeto utiliza o padrão **Event Sourcing**, onde todas as alterações de estado são persistidas como eventos imutáveis.

Em vez de armazenar apenas o saldo atual de uma carteira, o sistema registra toda a sua linha do tempo:

```text
WalletCreated
MoneyDeposited
MoneyWithdrawn
```

O estado atual da carteira é reconstruído pela reidratação do agregado `WalletAggregate`. A partir dos eventos persistidos também é possível calcular o saldo em uma data/hora anterior.

## 🏛 Arquitetura

O projeto segue uma arquitetura em camadas para manter a separação de responsabilidades:

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

---

## 🛠 Tecnologias

- Backend: Node.js, TypeScript, Fastify e Zod
- Persistência: MongoDB
- Frontend: React, Vite e Tailwind CSS
- Ambiente local: Docker Compose
- Testes: Node.js Test Runner com `tsx`
- Padrões: Event Sourcing, DDD e arquitetura em camadas

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
- [x] Depósito de valores positivos
- [x] Saque com validação de saldo suficiente
- [x] Consulta da timeline de eventos
- [x] Consulta do saldo em uma data/hora ISO 8601
- [x] Reidratação do agregado a partir dos eventos
- [x] Persistência do último `walletId` no navegador
- [x] Painel React para criar e consultar carteiras

---

## 🌐 API

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

O proxy do Vite para `/api` é usado por padrão durante o desenvolvimento.

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

### Próximos Passos

- [ ] Transferências entre carteiras
- [ ] Read models dedicados
- [ ] Controle de concorrência e versão esperada
- [ ] Idempotência das operações
- [ ] Persistência do event version por agregado
- [ ] Snapshots
- [ ] RabbitMQ
- [ ] Testes de integração
- [ ] Observabilidade e logs

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
