'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { CLARITY_ID, GA_ID, GTM_ID, evento } from '@/lib/analytics';

/**
 * Google Analytics 4 no site inteiro, com o código padrão do Google.
 *
 * Antes o site novo não tinha GA; o site antigo usava esta mesma propriedade
 * (G-LYX5T9ESB7), então o histórico continua nela. Com o gtag.js o GA4 registra
 * visitas, páginas vistas (inclusive na navegação interna, pela medição
 * otimizada) e a origem de cada visita pelos utm_ dos links das campanhas.
 *
 * Os cliques são lidos num ouvinte só, no documento, para não espalhar código
 * de medição pelos componentes:
 * - "clique" em todo link e botão, com o texto e o destino — é o ranking de cliques;
 * - "clique_inscricao", "clique_folder" e "clique_whatsapp" nos três que o
 *   comercial acompanha.
 *
 * O Google Tag Manager carrega junto, para as ferramentas que vierem por ele,
 * e o Microsoft Clarity (mapas de calor e gravações de sessão).
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
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <Script id="clarity" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_ID}");`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}
