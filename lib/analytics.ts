/**
 * Google Analytics 4 do site (propriedade da Plenum).
 *
 * O código padrão (gtag.js) entra em components/Analytics.tsx. Aqui fica só o
 * envio de eventos, para os formulários registrarem as conversões — inscrição
 * enviada, folder baixado, pedido de In Company. Esses eventos precisam ser
 * marcados como "evento principal" no painel do GA4 para virar conversão.
 */
export const GA_ID = 'G-03XW3FWG7L';

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
