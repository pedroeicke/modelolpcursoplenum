'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

/**
 * Chat de atendimento (Tawk.to), o mesmo que a Plenum usava no site anterior.
 *
 * Fica no canto inferior ESQUERDO de propósito: o botão do WhatsApp já ocupa o
 * canto direito em todas as páginas, e os dois no mesmo lugar se sobrepõem.
 * Não carrega no painel administrativo.
 */
const ID_PROPRIEDADE = '695b9dda14578f197fc14d8e';
const ID_WIDGET = '1je6u17qe';

export default function TawkChat() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <Script id="tawk-to" strategy="lazyOnload">
      {`
        var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
        Tawk_API.customStyle = {
          visibility: {
            desktop: { position: 'bl', xOffset: 20, yOffset: 20 },
            mobile:  { position: 'bl', xOffset: 12, yOffset: 80 }
          }
        };
        (function () {
          var s1 = document.createElement("script"),
              s0 = document.getElementsByTagName("script")[0];
          s1.async = true;
          s1.src = 'https://embed.tawk.to/${ID_PROPRIEDADE}/${ID_WIDGET}';
          s1.charset = 'UTF-8';
          s1.setAttribute('crossorigin', '*');
          s0.parentNode.insertBefore(s1, s0);
        })();
      `}
    </Script>
  );
}
