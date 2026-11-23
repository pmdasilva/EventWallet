# Architecture Decision Records

Este diretório registra decisões arquiteturais relevantes do Event Wallet. Os ADRs são escritos em português e seguem o formato definido em [`0000-template.md`](./0000-template.md).

## Como criar um ADR

1. Verifique os ADRs existentes e escolha o próximo número sequencial.
2. Copie o template e use o formato `NNNN-titulo-curto.md`.
3. Registre contexto, critérios, opções consideradas, decisão e consequências. Não invente justificativas que não estejam confirmadas.
4. Atualize o índice abaixo.
5. Depois de aceita, preserve a decisão como registro histórico. Para alterá-la, crie outro ADR e marque o anterior como `Substituída`.

O skill [`adr-documentation`](../../.github/skills/adr-documentation/SKILL.md) orienta o Copilot na criação e revisão dos registros.

## Índice

| ADR | Decisão | Status |
|---|---|---|
| [ADR-0001](./0001-use-event-sourcing.md) | Adotar Event Sourcing | Aceita |
| [ADR-0002](./0002-use-mongodb-event-store.md) | Usar MongoDB como Event Store | Aceita |
| [ADR-0003](./0003-fastify-as-api-framework.md) | Usar Fastify como framework da API | Aceita |
| [ADR-0004](./0004-deployment-strategy.md) | Separar o deploy do frontend e do backend | Aceita |
| [ADR-0005](./0005-adopt-cqrs-proposal.md) | Proposta de adoção de CQRS | Proposta |

O diagrama da arquitetura atual e da evolução proposta para CQRS está em [`docs/architecture/overview.md`](../architecture/overview.md).
