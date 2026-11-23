# ADR-0003: Usar Fastify como framework da API

- **Status:** Aceita
- **Data:** 2026-11-23

## Contexto

O backend precisa expor uma API HTTP para criar e consultar carteiras e registrar movimentações. O framework deve funcionar com Node.js e TypeScript e permitir organizar rotas e plugins usados pela aplicação.

## Critérios da decisão

- Compatibilidade com Node.js e TypeScript.
- Suporte a rotas HTTP e plugins.
- Adequação à escala e ao objetivo de estudo do projeto.

## Opções consideradas

### Fastify

Framework adotado pelo backend, com suporte a plugins e integração com TypeScript.

### Express

Alternativa conhecida para APIs Node.js. Na avaliação do projeto, Fastify foi considerado mais alinhado à preferência por uma arquitetura moderna e orientada a plugins.

## Decisão

Usar Fastify para inicializar a API e registrar as rotas HTTP. O servidor atual registra o plugin CORS e as rotas de carteira e health check.

## Consequências

### Positivas

- O sistema usa um framework leve com suporte a plugins.
- As rotas e a configuração do servidor ficam organizadas na camada de apresentação e inicialização.
- O plugin de CORS pode ser registrado junto ao servidor.

### Negativas e riscos

- A equipe precisa conhecer as APIs e convenções próprias do Fastify.
- A escolha limita o uso de integrações ou exemplos específicos de outros frameworks.

## Referências

- [Inicialização do servidor](../../wallet-event-sourcing/src/main/server.ts)
- [Rotas de carteira](../../wallet-event-sourcing/src/presentation/routes/wallet.routes.ts)
