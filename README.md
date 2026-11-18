# EventWallet
Este é um projeto que simula o estudo da arquitetura event source.

# Wallet Event Sourcing

Uma API de carteira digital desenvolvida com **Node.js**, **TypeScript**, **MongoDB** e **Event Sourcing**, com o objetivo de explorar conceitos avançados de arquitetura de software como **CQRS**, **DDD**, **Event Store**, **Auditoria de Eventos** e **Reconstrução de Estado**.

## 🎯 Objetivo

Diferente de uma aplicação CRUD tradicional, este projeto utiliza o padrão **Event Sourcing**, onde todas as alterações de estado são persistidas como eventos imutáveis.

Em vez de armazenar apenas o saldo atual de uma carteira, o sistema registra toda a sua linha do tempo:

```text
WalletCreated
MoneyDeposited
MoneyWithdrawn
TransferSent
TransferReceived
```

O estado atual da carteira é reconstruído a partir desses eventos.

## 🏛 Arquitetura

O projeto segue uma arquitetura em camadas para manter a separação de responsabilidades:

```text
src
├── application
├── domain
├── infrastructure
├── presentation
├── shared
└── main
```

### Camadas

- **Domain**: Regras de negócio, eventos e agregados.
- **Application**: Casos de uso e comandos.
- **Infrastructure**: Persistência e integração com MongoDB.
- **Presentation**: Rotas HTTP e controllers.
- **Main**: Inicialização da aplicação.

---

## 🛠 Tecnologias

- Node.js
- TypeScript
- Fastify
- MongoDB
- Docker
- Event Sourcing

---

## 📦 Event Store

Os eventos da aplicação são armazenados na coleção:

```text
wallet_events
```

Estrutura esperada de um evento:

```json
{
  "aggregateId": "wallet-123",
  "eventType": "MoneyDeposited",
  "occurredAt": "2026-01-10T10:00:00Z",
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
- [x] Recuperação de eventos por Aggregate

---

## 🚀 Executando o Projeto

### Instalar dependências

```bash
npm install
```

### Configurar variáveis de ambiente

Crie um arquivo `.env`:

```env
PORT=3000
MONGO_URI=mongodb://admin:admin@localhost:27017/?authSource=admin
```

### Subir MongoDB

```bash
docker compose up -d
```

### Executar aplicação

```bash
npm run dev
```

A API estará disponível em:

```text
http://localhost:3000
```

---

## ❤️ Roadmap

### MVP

- [x] Estrutura inicial
- [x] Event Store MongoDB
- [ ] Wallet Aggregate
- [ ] WalletCreated Event
- [ ] Criar carteira
- [ ] Depositar valor
- [ ] Sacar valor
- [ ] Consultar saldo
- [ ] Histórico de eventos

### Próximos Passos

- [ ] Transferências entre carteiras
- [ ] CQRS
- [ ] Read Models
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
