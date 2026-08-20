'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { MessageCircleMore } from 'lucide-react';

/**
 * Chat de atendimento (Tawk.to), o mesmo que a Plenum usava no site anterior.
 *
 * A bolha verde padrão do Tawk é escondida (hideWidget) e no lugar dela entra o
 * botão daqui, no navy/dourado da Plenum. O visual de dentro da janela de
 * conversa não dá para mudar por código: é um iframe de outro domínio. As cores
 * de lá se ajustam no painel do Tawk (Administração › Aparência do widget).
 *
 * O botão flutuante do WhatsApp foi retirado do site para não disputar espaço —
 * o contato por WhatsApp segue no cabeçalho, no rodapé e na faixa de contato.
 * Não carrega no painel administrativo.
 */
const ID_PROPRIEDADE = '695b9dda14578f197fc14d8e';
const ID_WIDGET = '1je6u17qe';

type TawkApi = {
  hideWidget?: () => void;
  maximize?: () => void;
  onLoad?: () => void;
  onChatMaximized?: () => void;
  onChatMinimized?: () => void;
  onChatHidden?: () => void;
  onUnreadCountChanged?: (total: number) => void;
};

declare global {
  interface Window {
    Tawk_API?: TawkApi;
  }
}

export default function TawkChat() {
  const pathname = usePathname();
  const noAdmin = Boolean(pathname?.startsWith('/admin'));

  const [pronto, setPronto] = useState(false);
  const [aberto, setAberto] = useState(false);
  const [naoLidas, setNaoLidas] = useState(0);

  useEffect(() => {
    if (noAdmin) return;

    const api: TawkApi = (window.Tawk_API = window.Tawk_API || {});

    // Quem esconde o widget é o onBeforeLoad, lá no script; aqui só liberamos
    // o nosso botão depois que a conexão com o Tawk está de pé.
    api.onLoad = () => {
      api.hideWidget?.();
      setPronto(true);
    };
    api.onChatMaximized = () => setAberto(true);
    // Ao minimizar, o Tawk traz a bolha dele de volta; escondemos outra vez.
    api.onChatMinimized = () => {
      api.hideWidget?.();
      setAberto(false);
      setNaoLidas(0);
    };
    api.onChatHidden = () => setAberto(false);
    api.onUnreadCountChanged = (total) => setNaoLidas(total || 0);
  }, [noAdmin]);

  if (noAdmin) return null;

  return (
    <>
      <Script id="tawk-to" strategy="lazyOnload">
        {`
          var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
          // Esconde o widget ANTES de ele desenhar, senao a barra verde padrao
          // pisca na tela por um instante antes de dar lugar ao nosso botao.
          Tawk_API.onBeforeLoad = function () {
            if (Tawk_API.hideWidget) Tawk_API.hideWidget();
          };
          Tawk_API.customStyle = {
            visibility: {
              desktop: { position: 'br', xOffset: 0, yOffset: 0 },
              mobile:  { position: 'br', xOffset: 0, yOffset: 0 }
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

      <button
        type="button"
        onClick={() => window.Tawk_API?.maximize?.()}
        aria-label="Abrir o chat de atendimento"
        className={`group fixed bottom-5 right-5 z-[60] flex items-center transition-all duration-300 ${
          pronto && !aberto
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-3 opacity-0'
        }`}
      >
        {/* Rótulo que expande no hover (só desktop) */}
        <span className="mr-3 hidden max-w-0 overflow-hidden whitespace-nowrap rounded-full bg-[#030D1F] px-0 py-3 text-sm font-semibold text-white opacity-0 shadow-[0_8px_28px_rgba(3,13,31,0.5)] ring-1 ring-[#C9A227]/35 transition-all duration-300 group-hover:max-w-[240px] group-hover:px-5 group-hover:opacity-100 lg:block">
          Falar com o atendimento
        </span>

        <span className="relative flex h-16 w-16 items-center justify-center">
          {/* anel pulsante dourado */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#C9A227] opacity-40 animate-ping motion-reduce:hidden" />
          {/* botão */}
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#E8C455] to-[#C9A227] text-[#030D1F] shadow-[0_10px_34px_rgba(201,162,39,0.55)] ring-1 ring-white/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_14px_44px_rgba(201,162,39,0.75)] group-active:scale-95">
            <MessageCircleMore className="h-8 w-8 transition-transform duration-300 group-hover:-rotate-6" strokeWidth={2} />
          </span>
          {naoLidas > 0 && (
            <span className="absolute -right-0.5 -top-0.5 z-10 flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[#030D1F] px-1.5 text-[12px] font-bold text-[#C9A227] ring-2 ring-[#C9A227]">
              {naoLidas > 9 ? '9+' : naoLidas}
            </span>
          )}
        </span>
      </button>
    </>
  );
}
