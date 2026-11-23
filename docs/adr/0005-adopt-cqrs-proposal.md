# ADR-0005: Proposta de adoção de CQRS

- **Status:** Proposta
- **Data:** 2026-11-23

## Contexto

Atualmente, o estado atual da carteira é reconstruído por replay dos eventos do agregado. A consulta de saldo histórico também percorre os eventos persistidos. À medida que o histórico cresce, reler eventos para atender consultas pode aumentar o custo de leitura.

O sistema ainda não possui projeções persistidas nem um modelo de leitura separado. Esta proposta descreve uma direção possível, não uma arquitetura já implementada ou aprovada.

## Critérios da decisão

- Preservar o Event Store como fonte de verdade.
- Evitar que as consultas mais frequentes precisem reconstruir o agregado a cada requisição.
- Permitir reconstruir os modelos de leitura a partir dos eventos.
- Manter explícitas as implicações de consistência eventual, caso aplicável.

## Opções consideradas

### Manter consultas baseadas diretamente no replay

Preserva a simplicidade atual, mas mantém o custo de replay nas consultas que precisam do estado.

### Introduzir CQRS com projeções de leitura

Separar o fluxo de comandos do fluxo de consultas e manter um ou mais modelos de leitura derivados dos eventos.

### Adicionar apenas snapshots ao replay

Reduziria o número de eventos a reaplicar para reidratar o agregado, mas não estabelece por si só modelos de leitura específicos para diferentes consultas.

## Decisão

Ainda não há decisão final. A proposta é avaliar a introdução de projeções e modelos de leitura derivados do Event Store, mantendo os comandos e os eventos existentes como fonte autoritativa.

O mecanismo de atualização das projeções, a tecnologia de armazenamento, a estratégia de consistência e as consultas que devem usar cada modelo precisam ser decididos antes de aceitar esta ADR.

## Consequências esperadas

### Potenciais benefícios

- Consultas podem ser atendidas sem replay completo do agregado.
- Podem ser criados modelos otimizados para diferentes necessidades de leitura.
- A projeção pode ser reconstruída a partir dos eventos, se o processo for definido para isso.

### Custos e riscos a avaliar

- A arquitetura e a operação ficam mais complexas.
- A atualização assíncrona pode introduzir consistência eventual.
- Será necessário tratar falhas, duplicidade, ordenação e reconstrução das projeções.
- O modelo de leitura pode ficar temporariamente defasado do Event Store.

## Questões em aberto

- Quais consultas devem ser atendidas por projeções?
- Como detectar e processar novos eventos para atualizar os modelos?
- Onde os modelos de leitura serão persistidos?
- Qual nível de consistência é aceitável para cada consulta?
- Como monitorar falhas e reconstruir uma projeção?

## Referências

- [Visão geral da arquitetura atual e proposta](../architecture/overview.md)
- [Carregamento e replay do agregado](../../wallet-event-sourcing/src/application/services/wallet-loader.service.ts)
- [Consulta de saldo histórico](../../wallet-event-sourcing/src/application/services/wallet-balance-at.service.ts)
