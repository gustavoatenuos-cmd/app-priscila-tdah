// Banco de frases de acolhimento para o app
// Aparecem de forma rotativa na home e em outros pontos

export const FRASES_ACOLHIMENTO = [
  "Você não travou, você cansou.",
  "Feito é melhor que perfeito.",
  "Seu cérebro não está com preguiça. Está sobrecarregado.",
  "Constância não é fazer todo dia. É voltar sempre que puder.",
  "Você não precisa dar conta de tudo. Só do próximo passo.",
  "Descansar não é desistir.",
  "Um dia ruim não apaga os bons.",
  "Recomeçar também é progresso.",
  "Você está aqui. Isso já é muito.",
  "O mínimo de hoje é a vitória de hoje.",
  "Não existe atraso quando se trata de cuidar de si.",
  "Seu ritmo é válido.",
  "Pare de se comparar. Comece a se cuidar.",
  "Pequeno passo, grande coragem.",
  "O app não te cobra. O app te acolhe.",
  "Permita-se ser humana.",
  "A pressa é inimiga da constância.",
  "Hoje não precisa ser produtivo. Precisa ser gentil.",
  "Cansou? Descanse. Travou? Respire. Voltou? Parabéns.",
  "Você é mais do que sua lista de tarefas.",
  "O próximo passo não precisa ser grande. Só precisa existir.",
  "Cada recomeço te fortalece.",
  "Você apareceu. Isso já é muito. 🌿",
];

// Retorna uma frase aleatória com base no dia do ano (determinística por dia)
export function fraseDodia(): string {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return FRASES_ACOLHIMENTO[dayOfYear % FRASES_ACOLHIMENTO.length];
}

// Retorna uma frase verdadeiramente aleatória
export function fraseAleatoria(): string {
  return FRASES_ACOLHIMENTO[Math.floor(Math.random() * FRASES_ACOLHIMENTO.length)];
}
