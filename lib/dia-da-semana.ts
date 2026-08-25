/**
 * O dia da semana escrito na programação não é confiável: as planilhas que a
 * equipe monta trazem ele digitado à mão e já vieram de mês errado mais de uma
 * vez. Aqui ele é recalculado a partir da data que está na própria etiqueta.
 *
 * Entrada:  "Dia 1 — Segunda, 15/09 · 08:00 às 12:00"
 * Saída:    "Dia 1 — Terça, 15/09 · 08:00 às 12:00"
 *
 * Se a etiqueta não tiver data, volta intacta.
 */
const DIAS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
const ABREVIADO: Record<string, string> = {
  Segunda: 'Seg', Terça: 'Ter', Quarta: 'Qua',
  Quinta: 'Qui', Sexta: 'Sex', Sábado: 'Sáb', Domingo: 'Dom',
};

const PADRAO =
  /(Segunda|Terça|Terca|Quarta|Quinta|Sexta|Sábado|Sabado|Domingo|Seg|Ter|Qua|Qui|Sex|Sáb|Sab|Dom)(\s*,\s*)(\d{2})\/(\d{2})/g;

export function corrigeDiaDaSemana(tag: string, dataInicio?: string | null): string {
  if (!tag) return tag;

  const inicio = dataInicio ? new Date(dataInicio) : null;
  const anoBase = inicio && !isNaN(inicio.getTime()) ? inicio.getUTCFullYear() : new Date().getFullYear();
  const mesInicio = inicio && !isNaN(inicio.getTime()) ? inicio.getUTCMonth() + 1 : null;

  return tag.replace(PADRAO, (inteiro, escrito: string, virgula: string, dd: string, mm: string) => {
    const dia = Number(dd);
    const mes = Number(mm);
    if (!dia || !mes || mes > 12 || dia > 31) return inteiro;

    // Turma que vira o ano (ex.: começa em dezembro e termina em janeiro).
    const ano = mesInicio !== null && mes < mesInicio ? anoBase + 1 : anoBase;

    const data = new Date(Date.UTC(ano, mes - 1, dia));
    if (isNaN(data.getTime())) return inteiro;

    // getUTCDay: 0 = domingo. A lista começa na segunda.
    const certo = DIAS[(data.getUTCDay() + 6) % 7];
    const saida = escrito.length <= 4 ? ABREVIADO[certo] : certo;
    return `${saida}${virgula}${dd}/${mm}`;
  });
}
