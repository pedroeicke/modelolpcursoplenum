import type { Metadata } from 'next';
import './globals.css';
import TawkChat from '@/components/TawkChat';

export const metadata: Metadata = {
  title: 'Instituto Plenum Brasil — Capacitação para o Setor Público',
  description: 'Formações executivas, seminários e congressos para gestores e servidores públicos. Cursos presenciais e híbridos em todo o Brasil.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <link rel="preload" href="/fonts/pp-radio-grotesk-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#030d1f] text-[#f5f5f5] antialiased" suppressHydrationWarning>
        {children}
        <TawkChat />
      </body>
    </html>
  );
}
