/**
 * Modalidade escolhida na inscrição (presencial / online).
 *
 * A tabela `inscricoes` ainda não tem coluna própria para isso, então o valor
 * viaja na primeira linha de `observacoes`, num formato fixo que dá para ler de
 * volta. Quando a coluna existir, é só trocar as duas funções abaixo:
 *
 *   alter table inscricoes add column modalidade text;
 */

export type Modalidade = 'presencial' | 'online';

const MARCA = /^\[Modalidade:\s*(Presencial|Online)\]\s*\n?/i;

export const LABEL_MODALIDADE: Record<Modalidade, string> = {
  presencial: 'Presencial',
  online: 'Online',
};

/** Junta a modalidade às observações do inscrito, para gravar no banco. */
export function comModalidade(observacoes: string | null, modalidade?: string | null): string | null {
  const m = (modalidade || '').toLowerCase();
  if (m !== 'presencial' && m !== 'online') return observacoes || null;
  const texto = (observacoes || '').trim();
  return `[Modalidade: ${LABEL_MODALIDADE[m as Modalidade]}]${texto ? `\n${texto}` : ''}`;
}

/** Separa o que é modalidade do que o inscrito realmente escreveu. */
export function leModalidade(observacoes: string | null): {
  modalidade: string | null;
  observacoes: string | null;
} {
  const bruto = observacoes || '';
  const achou = bruto.match(MARCA);
  if (!achou) return { modalidade: null, observacoes: observacoes || null };
  const resto = bruto.replace(MARCA, '').trim();
  return { modalidade: achou[1], observacoes: resto || null };
}
