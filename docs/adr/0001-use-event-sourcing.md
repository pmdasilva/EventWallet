# ADR-0001: Adotar Event Sourcing

- **Status:** Aceita
- **Data:** 2026-11-23

## Contexto

O Event Wallet é um projeto de estudo sobre arquitetura de software e precisa preservar o histórico das operações realizadas em cada carteira. Em uma abordagem CRUD que persiste somente o estado atual, reconstruir o saldo em um momento anterior exige armazenar histórico adicional.

O projeto já modela a criação, os depósitos e os saques como eventos de domínio e reconstrói o agregado reaplicando esses eventos.

## Critérios da decisão

- Preservar o histórico das alterações da carteira.
- Permitir reconstruir o estado atual e consultar o saldo em uma data passada.
- Manter o modelo alinhado aos objetivos educacionais de Event Sourcing.

## Opções consideradas

### Persistir apenas o estado atual (CRUD)

É uma abordagem direta para consultar o estado atual, mas não mantém por si só o histórico necessário para replay e consultas temporais.

### Persistir eventos de domínio (Event Sourcing)

Mantém as alterações como eventos imutáveis e permite reconstruir o estado a partir deles, com custo adicional de implementação e evolução dos eventos.

## Decisão

Persistir as alterações da carteira como eventos de domínio e reconstruir o agregado por replay. Entre os eventos atuais estão `WalletCreatedEvent`, `MoneyDepositedEvent` e `MoneyWithdrawnEvent`.

## Consequências

### Positivas

- O histórico das operações fica disponível para auditoria e replay.
- O estado pode ser reconstruído a partir dos eventos.
- É possível calcular o saldo em uma data/hora anterior.
- A arquitetura pode evoluir para separar modelos de escrita e leitura.

### Negativas e riscos

- A implementação é mais complexa do que persistir somente o estado atual.
- O replay pode exigir mais trabalho conforme o histórico cresce.
- A evolução e compatibilidade de versões dos eventos precisam ser tratadas.

## Referências

- [Visão geral da arquitetura](../architecture/overview.md)
- [Agregado da carteira](../../wallet-event-sourcing/src/domain/aggregates/wallet.aggregate.ts)
- [Serviço de saldo histórico](../../wallet-event-sourcing/src/application/services/wallet-balance-at.service.ts)
