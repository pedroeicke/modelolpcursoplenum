import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Emendas Parlamentares 2026 na Prática | Plenum Brasil',
  description: 'Execução, Transparência e Prestação de Contas (pós-mudanças do STF). Imersão presencial em Brasília/DF. 09 a 13 de Março de 2026.',
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
