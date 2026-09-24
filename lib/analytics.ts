/**
 * Google Analytics 4 do site: conta "Instituto Plenum Brasil", propriedade
 * "André Azevedo", fluxo www.plenumbrasil.com.br — a mesma que recebe as
 * landing pages do RD Station (separe pelo nome do host nos relatórios).
 * O dev.ia@plenumbrasil.com é administrador dela.
 *
 * O código padrão (gtag.js) entra em components/Analytics.tsx. Aqui fica só o
 * envio de eventos, para os formulários registrarem as conversões — inscrição
 * enviada, folder baixado, pedido de In Company. Esses eventos precisam ser
 * marcados como "evento principal" no painel do GA4 para virar conversão.
 */
export const GA_ID = 'G-LYX5T9ESB7';

/**
 * Google Tag Manager (conta "Plenum Brasil", contêiner www.plenumbrasil.com.br,
 * no dev.ia). Serve para as outras ferramentas (Clarity, pixel etc.). O GA4 NÃO
 * entra por ele — já vem direto pelo gtag.js; uma tag GA4 no GTM contaria em dobro.
 */
export const GTM_ID = 'GTM-TQ9KWB37';

/**
 * Microsoft Clarity (mapas de calor e gravações): projeto "Site Institucional"
 * no dev.ia. Mascara campos de formulário por padrão (CPF, CNPJ, e-mail da inscrição).
 */
export const CLARITY_ID = 'ync2rbop14';

type Parametros = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function evento(nome: string, parametros: Parametros = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', nome, parametros);
}
