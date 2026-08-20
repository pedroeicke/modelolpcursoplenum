'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

/**
 * Chat de atendimento (Tawk.to), o mesmo que a Plenum usava no site anterior.
 *
 * Fica empilhado LOGO ACIMA do botão do WhatsApp, no canto direito. O WhatsApp
 * é um círculo de 56px com 20px de margem (components/sections/WhatsAppFloat.tsx),
 * então o chat começa em 90px de altura para não encostar nele. Os dois no mesmo
 * canto ocupam uma coluna só e deixam o resto da tela livre — no canto esquerdo
 * o chat passava por cima dos botões do formulário.
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
            desktop: { position: 'br', xOffset: 20, yOffset: 90 },
            mobile:  { position: 'br', xOffset: 16, yOffset: 88 }
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
