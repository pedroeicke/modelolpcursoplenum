'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { GA_ID, evento } from '@/lib/analytics';

/**
 * Google Analytics 4 no site inteiro, com o código padrão do Google.
 *
 * Antes o site não tinha GA (o G-03XW3FWG7L que aparecia era da integração do
 * chat Tawk.to, numa conta antiga). Com o gtag.js o GA4 registra
 * visitas, páginas vistas (inclusive na navegação interna, pela medição
 * otimizada) e a origem de cada visita pelos utm_ dos links das campanhas.
 *
 * Os cliques são lidos num ouvinte só, no documento, para não espalhar código
 * de medição pelos componentes:
 * - "clique" em todo link e botão, com o texto e o destino — é o ranking de cliques;
 * - "clique_inscricao", "clique_folder" e "clique_whatsapp" nos três que o
 *   comercial acompanha.
 *
 * Não carrega no painel administrativo.
 */
export default function Analytics() {
  const pathname = usePathname() || '';
  const noAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    if (noAdmin) return;

    function aoClicar(e: MouseEvent) {
      const alvo = (e.target as HTMLElement | null)?.closest('a, button');
      if (!alvo) return;

      const texto = (alvo.textContent || alvo.getAttribute('aria-label') || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 100);
      const href = alvo instanceof HTMLAnchorElement ? alvo.getAttribute('href') || '' : '';
      const destino = alvo instanceof HTMLAnchorElement ? alvo.href : '';

      evento('clique', { texto, destino, tipo: alvo.tagName.toLowerCase() });

      if (href.startsWith('/inscricao') || destino.includes('/inscricao')) {
        evento('clique_inscricao', { texto, destino });
      } else if (href === '#folder' || /\.pdf($|\?)/i.test(destino)) {
        evento('clique_folder', { texto, destino });
      } else if (/wa\.me|whatsapp\.com/i.test(destino)) {
        evento('clique_whatsapp', { texto, destino });
      }
    }

    document.addEventListener('click', aoClicar, { capture: true });
    return () => document.removeEventListener('click', aoClicar, { capture: true });
  }, [noAdmin]);

  if (noAdmin) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
