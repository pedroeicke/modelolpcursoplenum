'use client';

import { Link2, Mail, Phone } from 'lucide-react';

const footerLinks = [
  {
    title: 'Navegação',
    links: [
      { label: 'Diferenciais', href: '#diferenciais' },
      { label: 'Para quem é', href: '#publico' },
      { label: 'Programação', href: '#programacao' },
      { label: 'Instrutora', href: '#instrutor' },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { label: 'Investimento', href: '#investimento' },
      { label: 'Material', href: '#folder' },
      { label: 'Inscrição', href: '#inscricao' },
      { label: 'Notificação', href: '#notificacao' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#020617] border-t border-white/[0.06] pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto">
        {/* ── Top Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          {/* Logo + Description */}
          <div className="md:col-span-2">
            <img
              src="/logo-plenum-aberta2.png"
              alt="Plenum"
              className="h-8 w-auto object-contain opacity-90 mb-5"
            />
            <p className="text-white/40 text-sm leading-relaxed max-w-[360px]">
              Capacitação em gestão pública com foco em emendas parlamentares, compliance e prestação de contas.
            </p>
          </div>

          {/* Link Columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="font-[var(--font-bricolage)] text-sm font-bold text-white mb-4 uppercase tracking-wider">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-white/40 text-sm hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom Bar ── */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            &copy; 2026 Plenum Brasil. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-3">
            <a
              href="https://www.plenumbrasil.com.br"
              target="_blank"
              rel="noopener"
              className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors"
              title="Website"
            >
              <Link2 className="w-4 h-4" />
            </a>
            <a
              href="mailto:contato@plenumbrasil.com.br"
              className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors"
              title="E-mail"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/553125311776"
              target="_blank"
              rel="noopener"
              className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors"
              title="WhatsApp"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
