import nodemailer from 'nodemailer';

/**
 * E-mail via SMTP — totalmente plugável por variáveis de ambiente.
 * Sem SMTP configurado, os envios são pulados silenciosamente (o site segue funcionando).
 *
 * Variáveis (.env.local / Vercel):
 *   SMTP_HOST=smtp.provedor.com
 *   SMTP_PORT=587
 *   SMTP_USER=contato@plenumbrasil.com.br
 *   SMTP_PASS=senha
 *   SMTP_FROM="Instituto Plenum Brasil <contato@plenumbrasil.com.br>"  (opcional; padrão = SMTP_USER)
 *   PLENUM_NOTIFY_EMAIL=um@email.com,outro@email.com  (aceita vários, separados por vírgula)
 */

export function isEmailConfigured(): boolean {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransport() {
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function send(to: string, subject: string, html: string): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.log(`[email] SMTP não configurado — pulando envio para ${to} (${subject})`);
    return false;
  }
  try {
    await getTransport().sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    return true;
  } catch (err) {
    console.error(`[email] Falha ao enviar para ${to}:`, err);
    return false;
  }
}

// ─── Templates ────────────────────────────────────────────

const wrapper = (content: string) => `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;color:#1a1a2e">
  <div style="background:#010814;padding:24px;text-align:center">
    <span style="color:#fff;font-size:20px;font-weight:bold">Instituto Plenum Brasil</span>
  </div>
  <div style="padding:32px 24px">${content}</div>
  <div style="background:#f1f5f9;padding:16px 24px;font-size:12px;color:#64748b;text-align:center">
    Instituto Plenum Brasil — Rua Espírito Santo, 1204 — 2º andar — Lourdes — Belo Horizonte/MG — CEP 30.160-033<br/>
    WhatsApp Amanda Baroni: (31) 2531-1776 · WhatsApp Débora dos Santos: (31) 98310-4093 · Fixo: (31) 2531-1776
  </div>
</div>`;

export interface InscricaoEmailData {
  cursoTitulo: string;
  turmaLabel: string;
  respNome: string;
  respEmail: string;
  respTelefone: string;
  numInscritos: number;
  nomesInscritos: string;
  orgaoRazaoSocial: string;
  municipio: string;
  estado: string;
  formaPagamento: string;
  /** Presencial | Online — como o inscrito vai participar */
  modalidade?: string | null;
}

/** Confirmação para o cliente que se inscreveu */
export async function sendClienteConfirmacao(d: InscricaoEmailData): Promise<boolean> {
  const html = wrapper(`
    <h2 style="margin:0 0 16px">Inscrição recebida com sucesso! ✅</h2>
    <p>Olá, <strong>${d.respNome}</strong>!</p>
    <p>Recebemos a sua inscrição no curso:</p>
    <div style="background:#f8fafc;border-left:4px solid #10b981;padding:16px;margin:16px 0">
      <strong style="font-size:16px">${d.cursoTitulo}</strong><br/>
      <span style="color:#64748b">Turma: ${d.turmaLabel}</span>${
        d.modalidade ? `<br/><span style="color:#64748b">Modalidade: <strong>${d.modalidade}</strong></span>` : ''
      }
    </div>
    <p><strong>Inscritos (${d.numInscritos}):</strong><br/>${d.nomesInscritos.replace(/\n/g, '<br/>')}</p>
    <p>Nossa equipe entrará em contato em breve para confirmar os detalhes e o pagamento (${d.formaPagamento}).</p>
    <p style="margin-top:24px">Qualquer dúvida, fale com a gente:<br/>
    <strong>WhatsApp Amanda Baroni:</strong> (31) 2531-1776<br/>
    <strong>WhatsApp Débora dos Santos:</strong> (31) 98310-4093</p>
  `);
  return send(d.respEmail, `Inscrição recebida — ${d.cursoTitulo}`, html);
}

/** Aviso para a Plenum de nova inscrição */
export async function sendPlenumAviso(d: InscricaoEmailData): Promise<boolean> {
  // aceita vários destinatários separados por vírgula (equipe comercial inteira)
  const to = (process.env.PLENUM_NOTIFY_EMAIL || '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean)
    .join(', ');
  if (!to) {
    console.log('[email] PLENUM_NOTIFY_EMAIL não configurado — pulando aviso interno');
    return false;
  }
  const html = wrapper(`
    <h2 style="margin:0 0 16px">🎉 Nova inscrição recebida!</h2>
    <div style="background:#f8fafc;border-left:4px solid #3b82f6;padding:16px;margin:16px 0">
      <strong style="font-size:16px">${d.cursoTitulo}</strong><br/>
      <span style="color:#64748b">Turma: ${d.turmaLabel}</span>${
        d.modalidade ? `<br/><span style="color:#64748b">Modalidade: <strong>${d.modalidade}</strong></span>` : ''
      }
    </div>
    <table style="width:100%;font-size:14px;border-collapse:collapse">
      <tr><td style="padding:6px 0;color:#64748b">Responsável</td><td style="padding:6px 0"><strong>${d.respNome}</strong></td></tr>
      <tr><td style="padding:6px 0;color:#64748b">E-mail</td><td style="padding:6px 0">${d.respEmail}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b">Telefone</td><td style="padding:6px 0">${d.respTelefone}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b">Órgão/Razão Social</td><td style="padding:6px 0">${d.orgaoRazaoSocial}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b">Município/UF</td><td style="padding:6px 0">${d.municipio}/${d.estado}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b">Nº de inscritos</td><td style="padding:6px 0"><strong>${d.numInscritos}</strong></td></tr>
      <tr><td style="padding:6px 0;color:#64748b">Inscritos</td><td style="padding:6px 0">${d.nomesInscritos.replace(/\n/g, '<br/>')}</td></tr>
      <tr><td style="padding:6px 0;color:#64748b">Pagamento</td><td style="padding:6px 0">${d.formaPagamento}</td></tr>
    </table>
    <p style="margin-top:24px">Veja todos os dados no painel: <a href="https://modelolpcursoplenum.vercel.app/admin/leads">Admin → Leads → Inscrições</a></p>
  `);
  return send(to, `Nova inscrição — ${d.cursoTitulo} (${d.respNome})`, html);
}
