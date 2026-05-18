# Plano mestre de implementação — TDAH Constante

Plano vivo, atualizado após a virada estratégica da [ADR-002](./adr-002-pivot-companheiro-diario.md).
Lançamento em **4 fases mensais**.

## Fase 0 — Fundação (✅ concluída)

- [x] Tom de voz alinhado ao livro 365 dias (landing, hero, onboarding intro).
- [x] Páginas legais: privacidade, termos, aviso clínico, exclusão de conta.
- [x] Banner de consentimento LGPD.
- [x] Sidebar com rótulos "Hoje" e "Planner" (a ser revisitada depois da virada).
- [x] ADR-001 (planner) e ADR-002 (virada estratégica) registrados.

## Mês 1 — Lançamento (em andamento)

### Fundação técnica
- [ ] Migration Supabase: `daily_content`, `user_journey`, `daily_checkins`, `daily_tasks` (limite 3), `travei_logs`, `floating_phrases`, `weekly_presence`.
- [ ] Seed do `daily_content` com os 365 dias extraídos do PDF.
- [ ] Trigger que cria `user_journey` ao registrar (start_date = data do cadastro, day_index = 1).

### UI / fluxo
- [ ] Refatorar `/dashboard` como "Hoje" minimalista: 1 frase do dia, 3 tarefas, 3 atalhos grandes (Presença, Travei, Recomeçar).
- [ ] `/dashboard/dia` — viewer do dia atual dos 365 (frase + reflexão + ação) com unlock duro.
- [ ] `/dashboard/dia/historico` — só dias já liberados, sem spoiler dos futuros.
- [ ] `/dashboard/presenca` — 3 cards (2 min, 5 min, 10 min) com frase de acolhimento e player/texto-guia.
- [ ] `/dashboard/travei` — 3 opções e frase automática.
- [ ] Componente `<RecomecarButton>` reutilizável.
- [ ] `<CheckInDiario>` (humor, energia, mínimo) — modal único do dia.
- [ ] Componente `<ConstanciaSemana>` (7 bolinhas, presentes vs. ausentes).
- [ ] `<FrasesFlutuantes>` rotativas.

### Limpeza
- [ ] Esconder `/therapeutic-planner` e `/focus` do menu (manter rotas vivas com aviso de descontinuação).
- [ ] Esconder `/analytics` complexo do menu.
- [ ] Onboarding reduzido a 3–4 perguntas (tom de suporte, horário preferido, gatilho inicial).

### Comercial
- [ ] Atualizar `/pricing` e Stripe: 30 dias grátis, cobrança a partir do dia 31.

## Mês 2 — Modo Cérebro

- [ ] Tabela `cerebro_content` (id, título, formato áudio/vídeo/texto, duração, tema, conteúdo).
- [ ] `/dashboard/cerebro` — biblioteca leve, ordenada por tema (dopamina, procrastinação, função executiva...).
- [ ] Player ou leitor simples; tudo ≤ 1 min.
- [ ] Anúncio in-app: "Novidade do mês: agora você entende o porquê do seu cérebro."

## Mês 3 — Áudios diários da Priscilla

- [ ] Tabela `daily_audio` (day_index, url do áudio, transcrição opcional).
- [ ] Player integrado ao `/dashboard/dia` com a voz da autora.
- [ ] Upload manual de áudios na pasta `public/audios/` ou Supabase Storage.
- [ ] Notificação push opcional "Seu áudio de hoje chegou."

## Mês 4 — Refinamentos e bônus (livre)

À critério do desenvolvedor com base em dados reais de uso. Hipóteses para validar:
- [ ] Áudios temáticos extras (sono, ansiedade, foco).
- [ ] Modo noite / dark mode confortável.
- [ ] Compartilhamento gentil ("vim, fiz o meu mínimo") em rede social.
- [ ] Reintrodução leve de personalização (ex.: hora do "Seu dia de hoje" baseada no horário do usuário).
- [ ] Pequeno painel de uso da Priscilla (admin) para ver constância agregada anonimizada.

## Riscos vivos

- O endpoint `/api/account/delete` é stub — hard delete real precisa de `SUPABASE_SERVICE_ROLE_KEY`.
- `handle_new_user` faz `ON CONFLICT DO UPDATE` sobrescrevendo `full_name` em re-auth.
- Erros TS pré-existentes em `components/ui/*` (button-1, dialog, fullscreen-calendar, particle-hero, vertical-cut-reveal) precisam ser tratados antes do build de produção.
- Áudios da Priscilla ainda não foram entregues — Mês 1 lança com texto-guia + frase de acolhimento; áudios entram quando os arquivos chegarem.
