/**
 * Uma turma vale até o fim do último dia do curso: durante o evento ela continua
 * visível e, no dia seguinte, sai do ar sozinha.
 *
 * A regra mora aqui porque três lugares precisam dela e não podem divergir:
 * a vitrine (lib/courses-db.ts), a landing page do curso e o formulário de
 * inscrição. Antes só a vitrine filtrava, então a página do curso continuava
 * no ar vendendo turma que já tinha acontecido.
 */
export function turmaVigente(
  turma: { start_date: string; end_date?: string | null },
  agora: number = Date.now()
): boolean {
  const fim = new Date(turma.end_date || turma.start_date);
  fim.setHours(23, 59, 59, 999);
  return fim.getTime() >= agora;
}
