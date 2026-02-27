import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Relacionamento Governamental e Captação de Recursos | Plenum Brasil',
  description: 'Como Transformar Agendas em Brasília em Recursos, Convênios e Resultados para o Município. 10 a 13 de Março 2026, Presencial em Brasília/DF.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="bg-[#030d1f] text-[#f5f5f5] antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
