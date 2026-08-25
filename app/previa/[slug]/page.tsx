import { notFound } from 'next/navigation';
import PaginaDoCurso from '@/components/PaginaDoCurso';

/**
 * Prévia da landing page: mostra o curso mesmo em rascunho, para a equipe
 * revisar antes de publicar. Protegida por token para não virar porta dos
 * fundos — sem ele, ou com ele errado, responde 404 como qualquer página que
 * não existe, sem revelar que a rota existe.
 *
 * O endereço é /previa/<slug>?token=<PREVIEW_TOKEN>.
 */
export const dynamic = 'force-dynamic';   // nunca fica em cache
export const metadata = { robots: { index: false, follow: false } };

export default async function PreviaDoCurso({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const [{ slug }, { token }] = await Promise.all([params, searchParams]);
  const esperado = process.env.PREVIEW_TOKEN;

  if (!esperado || token !== esperado) {
    notFound();
  }

  return (
    <>
      <div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: '#C9A227', color: '#030D1F', textAlign: 'center',
          padding: '6px 12px', fontSize: 13, fontWeight: 600,
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        Prévia — este curso ainda não está publicado
      </div>
      <PaginaDoCurso slug={slug} ignorarStatus />
    </>
  );
}
