# ADR 002 — Virada estratégica: companheiro diário de presença

**Data:** 2026-05-09
**Status:** Aceito
**Substitui:** boa parte das premissas do plano-estrategico-app-tdah-constante.docx (Fases 5 a 14 daquele documento).

## Contexto

O plano estratégico original tratava o TDAH Constante como um "sistema digital" rico, com dashboard como central de decisão, planner por método, foco inteligente, journal terapêutico, roda da vida interpretativa, integrações Google e motor de personalização. Em alinhamento com a Priscilla em 09/05/2026, ficou claro que essa direção estava reproduzindo a complexidade de um Notion/Todoist com cara de TDAH, e isso entra em conflito com a realidade do público: pessoas com TDAH não abrem um app de 12 funcionalidades — elas abrem, fazem 1 coisa, fecham.

## Decisão

O TDAH Constante passa a ser um **companheiro diário de presença**, com a voz da Priscilla no centro. O design respeita um princípio único e inviolável: **abrir, ler/fazer em menos de 60 segundos, fechar**.

### Princípios

1. **Leveza absoluta**: poucos botões, decisões simples, ação imediata.
2. **Conteúdo no centro, não funcionalidades**: o livro 365 dias é a espinha dorsal, com unlock duro de 1/dia.
3. **Sem cobrança e sem rigidez**: streak vira "constância da semana" (quantos dias apareceu, não sequência perfeita). Botão "Recomeçar" disponível sempre, sem reset negativo.
4. **Microação > planejamento**: máximo 3 tarefas/dia (essencial, leve, opcional) com confirmação "fiz mesmo que mínimo".
5. **Saída rápida da paralisia**: botão "Travei" com 3 opções diretas (1 min, levantar e respirar, versão mínima da tarefa).
6. **Voz humana**: áudios curtos da Priscilla a partir do Mês 1, quando os arquivos estiverem disponíveis.

### O que sai do produto (deprecação)

- `/dashboard/therapeutic-planner` inteiro (subpáginas weekly, monthly, exercises, focus-training, mind-dump, reflection, energy-checklist).
- `/dashboard/planner` com 3 níveis de prioridade — substituído pelo modelo de 3 tarefas fixas.
- `/dashboard/focus` com cronômetro elaborado — substituído por "Momento Presença" (2, 5 ou 10 min).
- `/dashboard/analytics` com roda da vida, scores por pilar, correlações e simulações.
- Onboarding ampliado de 12 perguntas — volta a ser curto (3–4 perguntas no máximo).
- Motor de personalização determinístico planejado na ADR-001/Fase 2.

As rotas continuam existindo por algumas semanas (para não quebrar links), mas saem da navegação principal e ganham um aviso "esta área será descontinuada".

### O que entra

| Recurso | Mês | Descrição |
|---|---|---|
| 365 dias com unlock duro 1/dia | 1 | Frase curta + reflexão breve + ação prática, extraídos do PDF da Priscilla |
| 3 tarefas fixas/dia | 1 | Essencial / leve / opcional; botão "fiz mesmo que mínimo" |
| Momento Presença 2 / 5 / 10 min | 1 | Frase de acolhimento + áudio ou texto guiado |
| Botão Travei | 1 | 3 saídas: 1 min, levantar e respirar, versão mínima |
| Botão Recomeçar | 1 | Reentrada gentil, sem zerar nada |
| Check-in emocional diário | 1 | Humor, energia, fez o mínimo |
| Constância semanal | 1 | Dias presentes da semana, não streak |
| Frases flutuantes | 1 | Lembretes leves rotativos ("você não travou, você cansou") |
| Modo Cérebro | 2 | Micropílulas de até 1 min sobre dopamina, procrastinação, função executiva |
| Áudios diários da Priscilla | 3 | Acolhimento de 1 min/dia com a voz da autora |
| Refinamentos e bônus | 4 | À critério do desenvolvedor com base em dados de uso |

### Modelo comercial

30 dias grátis, cobrança a partir do dia 31. Esse modelo:
- Casa com o tom "você só paga quando o app já tiver provado valor".
- Dá tempo para a usuária formar hábito antes de qualquer fricção.
- Funciona com o unlock duro: ela vai querer continuar para destravar os próximos dias.

A página `/pricing` e o webhook do Stripe continuam, com ajuste de teste gratuito de 7 → 30 dias.

### Lançamento em fases mensais

Cada mês é também um gancho de comunicação no Instagram. Em vez de "lançar tudo", a Priscilla anuncia a novidade do mês.

## Consequências

Positivas:
- Tempo até a usuária sentir valor cai drasticamente (D1 já tem conteúdo, ação e saída rápida da paralisia).
- Conteúdo da Priscilla deixa de ser apoio e vira o coração do produto — fortalece autoridade da marca.
- Retenção melhora pela combinação unlock duro + ausência de punição por falhar.
- Produção fica realista: dá para fazer Mês 1 em semanas, não meses.

Negativas:
- Trabalho já feito em `/therapeutic-planner` (várias páginas) será arquivado. Aceitável: foi protótipo.
- Sem motor de personalização, o app fala mais "para todas" que "para você". Mitigação: onboarding curto ajusta tom e horário; Mês 4 pode reintroduzir personalização leve se os dados pedirem.
- Sem integrações Google Calendar/Tasks. Mitigação: o modelo de 3 tarefas/dia não compete com a agenda da pessoa, e sim com o caos mental.

## Alternativas consideradas

1. **Manter o roadmap original** (Notion-com-cara-de-TDAH): rejeitada — público alvo não usa apps complexos.
2. **Manter as duas visões em coexistência** (modo simples + modo avançado): rejeitada — fragmenta produto, marca e investimento de tempo. A pessoa com TDAH não escolhe modos, ela usa o que aparece.
