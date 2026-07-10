import { createClient } from '@/lib/supabase/server';
import { getAllCourses } from '@/lib/queries/courses';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const formTypeMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  folder: { label: 'Folder', variant: 'default' },
  in_company: { label: 'In Company', variant: 'secondary' },
  notification: { label: 'Notificação', variant: 'outline' },
};

const statusMap: Record<string, { label: string; cls: string }> = {
  nova: { label: 'Nova', cls: 'bg-emerald-100 text-emerald-800' },
  em_atendimento: { label: 'Em atendimento', cls: 'bg-amber-100 text-amber-800' },
  confirmada: { label: 'Confirmada', cls: 'bg-blue-100 text-blue-800' },
  cancelada: { label: 'Cancelada', cls: 'bg-gray-200 text-gray-600' },
};

interface LeadRow {
  id: string;
  course_id: string | null;
  form_type: string;
  nome: string;
  email: string | null;
  whatsapp: string | null;
  estado: string | null;
  cidade: string | null;
  orgao: string | null;
  created_at: string;
}

interface InscricaoRow {
  id: string;
  course_id: string | null;
  course_date_id: string | null;
  tipo_instituicao: string;
  num_inscritos: number;
  nomes_inscritos: string;
  municipio: string;
  estado: string;
  razao_social: string;
  cnpj: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  uf: string;
  resp_nome: string;
  resp_cpf: string;
  resp_email: string;
  resp_telefone: string;
  observacoes: string | null;
  forma_pagamento: string;
  data_nota_fiscal: string | null;
  vencimento_igual_inicio: boolean;
  status: string;
  email_cliente_enviado: boolean;
  email_plenum_enviado: boolean;
  created_at: string;
}

function Campo({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">{label}</p>
      <p className="text-sm text-gray-900">{value || '—'}</p>
    </div>
  );
}

export default async function AdminLeadsPage() {
  const supabase = await createClient();

  const [{ data: leadsData }, { data: inscricoesData }] = await Promise.all([
    supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(200),
    supabase.from('inscricoes').select('*').order('created_at', { ascending: false }).limit(200),
  ]);

  const leads = (leadsData || []) as unknown as LeadRow[];
  const inscricoes = (inscricoesData || []) as unknown as InscricaoRow[];
  const courses = await getAllCourses();
  const courseMap = new Map(courses.map((c) => [c.id, c.title]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <p className="text-sm text-gray-500 mt-1">
          {inscricoes.length} inscriç{inscricoes.length === 1 ? 'ão' : 'ões'} · {leads.length} lead
          {leads.length !== 1 ? 's' : ''}
        </p>
      </div>

      <Tabs defaultValue="inscricoes">
        <TabsList>
          <TabsTrigger value="inscricoes">
            Inscrições
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              {inscricoes.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="leads">
            Leads
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-bold">
              {leads.length}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* ── Aba Inscrições ── */}
        <TabsContent value="inscricoes">
          <Card>
            <CardHeader>
              <CardTitle>Inscrições nos cursos</CardTitle>
            </CardHeader>
            <CardContent>
              {inscricoes.length === 0 ? (
                <p className="text-sm text-gray-500 py-8 text-center">
                  Nenhuma inscrição recebida ainda.
                </p>
              ) : (
                <div className="space-y-3">
                  {inscricoes.map((i) => {
                    const st = statusMap[i.status] || statusMap.nova;
                    return (
                      <details
                        key={i.id}
                        className="group rounded-lg border border-gray-200 open:shadow-sm"
                      >
                        <summary className="flex items-center gap-4 px-4 py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                          <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180 shrink-0" />
                          <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-1 items-center">
                            <span className="font-medium text-sm text-gray-900 truncate">{i.resp_nome}</span>
                            <span className="text-sm text-gray-500 truncate hidden md:block">
                              {i.course_id ? courseMap.get(i.course_id) || '—' : '—'}
                            </span>
                            <span className="text-sm text-gray-500">
                              {i.num_inscritos} inscrito{i.num_inscritos > 1 ? 's' : ''}
                            </span>
                            <span className={`justify-self-start px-2 py-0.5 rounded-full text-[11px] font-bold ${st.cls}`}>
                              {st.label}
                            </span>
                            <span className="text-sm text-gray-400 whitespace-nowrap">
                              {new Date(i.created_at).toLocaleDateString('pt-BR')}{' '}
                              {new Date(i.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </summary>

                        <div className="border-t border-gray-100 px-5 py-5 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5 bg-gray-50/50">
                          <div className="md:col-span-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Curso</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
                              <Campo label="Curso" value={i.course_id ? courseMap.get(i.course_id) : '—'} />
                              <Campo label="Tipo de instituição" value={i.tipo_instituicao} />
                              <Campo label="Município/UF" value={`${i.municipio}/${i.estado}`} />
                              <div className="md:col-span-3">
                                <Campo
                                  label={`Inscritos (${i.num_inscritos})`}
                                  value={<span className="whitespace-pre-line">{i.nomes_inscritos}</span>}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="md:col-span-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Nota Fiscal</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
                              <Campo label="Razão social" value={i.razao_social} />
                              <Campo label="CNPJ" value={i.cnpj} />
                              <Campo label="CEP" value={i.cep} />
                              <Campo
                                label="Endereço"
                                value={`${i.endereco}, ${i.numero}${i.complemento ? ` — ${i.complemento}` : ''}`}
                              />
                              <Campo label="Bairro" value={i.bairro} />
                              <Campo label="Cidade/UF" value={`${i.cidade}/${i.uf}`} />
                            </div>
                          </div>

                          <div className="md:col-span-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Responsável</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
                              <Campo label="Nome" value={i.resp_nome} />
                              <Campo label="CPF" value={i.resp_cpf} />
                              <Campo label="E-mail" value={i.resp_email} />
                              <Campo label="Telefone" value={i.resp_telefone} />
                              <div className="md:col-span-2">
                                <Campo label="Observações" value={i.observacoes} />
                              </div>
                            </div>
                          </div>

                          <div className="md:col-span-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Pagamento</p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
                              <Campo label="Forma de pagamento" value={i.forma_pagamento} />
                              <Campo
                                label="Data para NF"
                                value={i.data_nota_fiscal ? new Date(i.data_nota_fiscal + 'T12:00:00').toLocaleDateString('pt-BR') : '—'}
                              />
                              <Campo
                                label="Vencimento = início do curso"
                                value={i.vencimento_igual_inicio ? 'Sim' : 'Não'}
                              />
                              <Campo
                                label="E-mails"
                                value={`Cliente: ${i.email_cliente_enviado ? 'enviado ✓' : 'não enviado'} · Plenum: ${i.email_plenum_enviado ? 'enviado ✓' : 'não enviado'}`}
                              />
                            </div>
                          </div>
                        </div>
                      </details>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Aba Leads ── */}
        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Últimos Leads</CardTitle>
            </CardHeader>
            <CardContent>
              {leads.length === 0 ? (
                <p className="text-sm text-gray-500 py-8 text-center">
                  Nenhum lead capturado ainda.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>WhatsApp</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Curso</TableHead>
                        <TableHead>UF</TableHead>
                        <TableHead>Órgão</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leads.map((lead) => {
                        const ft = formTypeMap[lead.form_type] || formTypeMap.folder;
                        return (
                          <TableRow key={lead.id}>
                            <TableCell className="font-medium">{lead.nome}</TableCell>
                            <TableCell className="text-sm">{lead.email || '—'}</TableCell>
                            <TableCell className="text-sm">{lead.whatsapp || '—'}</TableCell>
                            <TableCell>
                              <Badge variant={ft.variant}>{ft.label}</Badge>
                            </TableCell>
                            <TableCell className="text-sm max-w-[150px] truncate">
                              {lead.course_id ? (courseMap.get(lead.course_id) || lead.course_id) : '—'}
                            </TableCell>
                            <TableCell className="text-sm">{lead.estado || '—'}</TableCell>
                            <TableCell className="text-sm">{lead.orgao || '—'}</TableCell>
                            <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                              {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
