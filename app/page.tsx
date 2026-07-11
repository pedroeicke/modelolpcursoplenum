import { redirect } from 'next/navigation';

/**
 * Homepage — o site "começa" na página institucional da Plenum.
 * As landing pages dos cursos vivem em /cursos/[slug]; quem chega na raiz
 * é enviado para o site principal.
 */
const MAIN_SITE_URL =
  process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'https://plenum-flax.vercel.app';

export default function Home() {
  redirect(MAIN_SITE_URL);
}
