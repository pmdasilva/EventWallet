---
name: adr-documentation
description: Create, review, and maintain Architecture Decision Records (ADRs) for this repository. Use when documenting or evaluating architectural decisions, recording why a design was chosen, or updating the project architecture decision log.
---

# Documenting architecture decisions

Use this skill to create and maintain ADRs for Event Wallet. Write ADRs in Portuguese, matching the project's existing documentation.

## Repository conventions

- Store records in `docs/adr/` and use sequential filenames such as `0001-adotar-event-sourcing.md`.
- Follow the template in `docs/adr/0000-template.md`.
- Update `docs/adr/README.md` whenever an ADR is added or its status changes.
- Keep each ADR focused on one decision. Link related decisions rather than combining unrelated topics.
- Use ISO dates (`YYYY-MM-DD`) and one of these statuses: `Proposta`, `Aceita`, `Rejeitada`, `Depreciada`, or `Substituída`.
- Treat accepted ADRs as historical records. Do not silently rewrite their rationale or outcome; record a new ADR and mark the previous one as `Substituída` when a decision changes. Correct typos without changing meaning.

## Workflow

1. Inspect relevant source code, tests, configuration, and documentation before describing the current system.
2. Separate verified facts from assumptions. Never invent decision-makers, constraints, alternatives, rationale, dates, or outcomes. Ask the user when essential decision context is missing; otherwise mark the ADR as `Proposta` and identify open questions.
3. Describe the context and problem, the forces shaping the decision, the options considered, the decision, and its positive and negative consequences.
4. Include relevant repository paths and links to related ADRs when useful. Never include credentials, tokens, private connection strings, or personal data.
5. Choose the next sequential ADR number by inspecting `docs/adr/`; do not reuse an existing number.
6. Update the ADR index and validate that the filename, title, status, date, and index entry agree.
7. Summarize the ADR created or changed and call out unresolved assumptions.

## Review checklist

- Does the record capture a decision rather than only describe implementation?
- Is its status clear and consistent with the decision history?
- Are alternatives and consequences specific, balanced, and supported by evidence?
- Can a reader understand the decision without relying on undocumented conversation context?
- Are references valid and free of secrets?
