# ADR 001 — Arquitetura do Planner

**Data:** 2026-05-09
**Status:** Aceito (Fase 1)

## Contexto

Existiam duas rotas concorrentes que pareciam se sobrepor:

- `/dashboard/planner` — listagem de tarefas (essencial / importante / opcional) com persistência na tabela `tasks`.
- `/dashboard/therapeutic-planner` — estrutura mais ampla com submódulos (`weekly`, `monthly`, `exercises`, `mind-dump`, `reflection`, `energy-checklist`, `focus-training`) com persistência em `therapeutic_plans`, `exercise_logs`, `reflections`.

O plano estratégico do produto pede um único "planner por método, não por lista comum", o que gerou ambiguidade sobre qual rota é canônica.

## Decisão

Manter as duas rotas com responsabilidades claramente distintas:

- **`/dashboard/planner` → "Hoje"** — visão diária e rápida. Captura de tarefas novas, marcação de concluídas, top 3 do dia. É o destino mais frequente. Modelo: `tasks`.
- **`/dashboard/therapeutic-planner` → "Planner"** — estrutura semanal e mensal: prioridades essenciais, hábitos de constância, desafios e ajustes, esquecimentos, delegáveis, exercícios terapêuticos, reflexão. Mais profundo, usado em revisões. Modelo: `therapeutic_plans`, `exercise_logs`, `reflections`.

A sidebar reflete essa distinção com os rótulos **"Hoje"** e **"Planner"** (commit que acompanha este ADR).

## Consequências

Positivas:

- A usuária ganha uma rota leve para o dia a dia ("Hoje") sem precisar atravessar a estrutura semanal/mensal.
- O planner terapêutico mantém profundidade para uso menos frequente.
- A confusão entre os dois desaparece com rótulos claros.

Negativas / a observar:

- Tarefas criadas em "Hoje" não aparecem automaticamente nas prioridades semanais do "Planner" — uma ponte (sync ou conversão) precisa ser desenhada na Fase 3.
- A Fase 3 deve avaliar se faz sentido permitir que uma prioridade essencial da semana vire automaticamente uma tarefa em "Hoje".

## Alternativas consideradas

1. **Unificar tudo em `/dashboard/planner`** com tabs "Dia / Semana / Mês". Rejeitada porque mistura cargas cognitivas muito diferentes em um mesmo espaço, contrariando o pilar "leveza" do produto.
2. **Apagar `/dashboard/planner`** e usar somente o terapêutico. Rejeitada porque a interação diária precisa ser o caminho mais curto possível.
