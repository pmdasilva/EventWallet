# Visão geral da arquitetura

Este documento descreve a arquitetura atual do Event Wallet e uma possível evolução para CQRS. A arquitetura futura é uma proposta associada à [ADR-0005](../adr/0005-adopt-cqrs-proposal.md); não representa comportamento implementado.

## Arquitetura atual

O frontend React chama a API Fastify por HTTP. A API grava eventos no MongoDB e reconstrói o estado atual da carteira por replay. Consultas de histórico também leem os eventos persistidos.

```mermaid
flowchart LR
    user[Usuário]
    frontend["React + Vite<br/>Vercel"]
    api["Fastify API<br/>Railway"]

    subgraph application["Aplicação e domínio"]
        routes["Rotas REST"]
        commands["Handlers de comandos"]
        loader["WalletLoaderService"]
        aggregate["WalletAggregate<br/>rehydrate / apply"]
        queries["Serviços de consulta"]
    end

    eventStore["MongoEventStore"]
    mongo[("MongoDB<br/>walletdb.wallet_events")]

    user --> frontend
    frontend -->|"HTTP / JSON"| api
    api --> routes

    routes --> commands
    commands --> loader
    loader -->|"Lê eventos por carteira"| eventStore
    eventStore -->|"Eventos ordenados por occurredAt"| loader
    loader --> aggregate
    aggregate -->|"Evento de domínio para persistir"| eventStore

    routes --> queries
    queries -->|"Consulta eventos / replay"| eventStore
    eventStore -->|"Eventos persistidos"| queries
    queries -->|"Estado atual reidratado"| aggregate

    eventStore -->|"insertOne / find"| mongo
    mongo -->|"Documentos de evento"| eventStore
```

### Características observadas

- O Event Store é a fonte dos eventos de domínio.
- `WalletAggregate.rehydrate` aplica os eventos para reconstruir o estado da carteira.
- Os eventos são armazenados na coleção `wallet_events`, agrupados por `aggregateId`.
- A leitura dos eventos do agregado é ordenada por `occurredAt`.
- As consultas da API compartilham o Event Store; ainda não há um read model persistido separado.

## Arquitetura futura proposta: CQRS

A proposta é manter o fluxo de escrita baseado em comandos e eventos e adicionar projeções para atender consultas. O Event Store continua como fonte autoritativa; o mecanismo de processamento e a persistência dos read models ainda precisam ser decididos.

```mermaid
flowchart LR
    user[Usuário]
    frontend["React + Vite<br/>Vercel"]
    api["Fastify API<br/>Railway"]

    subgraph write["Fluxo de escrita"]
        commandRoutes["Rotas de comando"]
        handlers["Handlers"]
        aggregate["WalletAggregate"]
    end

    eventStore[("Event Store<br/>MongoDB")]

    subgraph read["Fluxo de leitura proposto"]
        queryRoutes["Rotas de consulta"]
        queryService["Serviços de consulta"]
        projection["Processador de projeções<br/>a definir"]
        readModel[("Read model<br/>armazenamento a definir")]
    end

    user --> frontend
    frontend -->|"Comandos e consultas"| api
    api --> commandRoutes
    api --> queryRoutes

    commandRoutes --> handlers
    handlers --> aggregate
    aggregate -->|"Eventos de domínio"| eventStore

    eventStore -.->|"Processamento / transporte a definir"| projection
    projection -->|"Atualiza projeções"| readModel

    queryRoutes --> queryService
    queryService -->|"Consultas otimizadas"| readModel
    queryService -.->|"Histórico e reconstrução, se necessário"| eventStore

    classDef proposed stroke-dasharray: 5 5
    class projection,readModel,queryRoutes,queryService proposed
```

### Pontos ainda não decididos

- Quais consultas usarão read models e quais continuarão lendo o Event Store.
- Como as projeções receberão os eventos e como tratarão ordenação e duplicidade.
- Qual será a tecnologia de armazenamento dos read models.
- Qual nível de consistência será aceitável entre eventos e projeções.
- Como monitorar, reparar e reconstruir projeções.

Consulte a [ADR-0005](../adr/0005-adopt-cqrs-proposal.md) para o contexto, as alternativas e as questões em aberto.
