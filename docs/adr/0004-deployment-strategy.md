# ADR-0004: Separar o deploy do frontend e do backend

- **Status:** Aceita
- **Data:** 2026-11-23

## Contexto

O projeto precisa disponibilizar uma demonstração pública do painel web e da API. Frontend, backend e banco de dados têm processos de execução diferentes e podem ser implantados como serviços separados.

## Critérios da decisão

- Disponibilizar o painel e a API por endpoints públicos.
- Implantar cada componente no serviço adequado à sua tecnologia.
- Integrar o deploy ao repositório GitHub.

## Opções consideradas

### Implantar os componentes separadamente

Usar Vercel para o frontend e Railway para a API e o MongoDB.

### Implantar todos os componentes em um único serviço

Manter frontend, API e banco de dados sob uma única implantação, aumentando o acoplamento entre processos com requisitos diferentes.

## Decisão

Implantar os componentes separadamente:

- **Frontend:** Vercel.
- **API:** Railway.
- **MongoDB:** Railway.

A aplicação frontend aponta para a API por meio da variável `VITE_API_BASE_URL`. A API permite chamadas cross-origin por meio do plugin CORS do Fastify.

## Consequências

### Positivas

- Cada componente tem um ciclo de deploy independente.
- O código fonte e as implantações são integrados ao GitHub.
- A solução é adequada para a demonstração e o portfólio do projeto.

### Negativas e riscos

- A aplicação depende de provedores externos e da configuração correta entre os serviços.
- Variáveis de ambiente, CORS e URLs de deploy precisam permanecer sincronizados.
- Os limites dos planos dos provedores podem afetar a disponibilidade.

## Referências

- [Visão geral da arquitetura](../architecture/overview.md)
- [Configuração do servidor e CORS](../../wallet-event-sourcing/src/main/server.ts)
- [Cliente HTTP do frontend](../../wallet-frontend/src/api.ts)
