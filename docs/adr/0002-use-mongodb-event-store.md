# ADR-0002: Usar MongoDB como Event Store

- **Status:** Aceita
- **Data:** 2026-11-23

## Contexto

O Event Store precisa persistir os eventos da carteira, incluindo um payload que varia conforme o tipo de evento. O projeto também busca manter a infraestrutura adequada ao seu escopo de estudo e implantação.

Atualmente, a implementação usa a base `walletdb` e a coleção `wallet_events`. Cada documento registra `aggregateId`, `eventType`, `occurredAt`, `version` e `payload`.

## Critérios da decisão

- Persistir eventos e seus payloads com pouca transformação.
- Consultar eventos por agregado e em ordem cronológica.
- Manter a infraestrutura operacional simples para o projeto.

## Opções consideradas

### MongoDB

Armazena cada evento como documento e permite persistir payloads de formatos diferentes.

### PostgreSQL

Uma alternativa relacional, que exigiria definir como representar e consultar os payloads dos diferentes eventos.

### Banco especializado em Event Store

Uma opção dedicada ao armazenamento de eventos, mas que adicionaria outra tecnologia à infraestrutura do projeto.

## Decisão

Usar MongoDB como Event Store. A implementação atual grava os eventos na coleção `wallet_events` e busca os eventos de um agregado ordenados por `occurredAt`.

## Consequências

### Positivas

- O formato de documento acomoda os payloads dos diferentes eventos.
- A solução usa a infraestrutura MongoDB já adotada pelo projeto.
- O modelo é simples para o escopo educacional atual.

### Negativas e riscos

- MongoDB não é um produto especializado em Event Sourcing.
- A aplicação precisa manter a disciplina de ordenação, versionamento e compatibilidade dos eventos.
- A consistência e concorrência de gravações por agregado ainda precisam ser avaliadas conforme o sistema evoluir.

## Referências

- [Conexão com MongoDB](../../wallet-event-sourcing/src/infrastructure/database/mongo.ts)
- [Implementação do Event Store](../../wallet-event-sourcing/src/infrastructure/event-store/MongoEventStore.ts)
