// Cursos reais do Supabase (mesmo banco do admin/landing pages).
// Leitura pública (anon key) via REST — cadastrou curso no admin, aparece aqui.


import { turmaVigente } from "@/lib/turma-vigente";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://jyackmnjhsdllfqqxund.supabase.co";
// chave anon é pública por design (mesma exposta no navegador pela LP)
const SUPABASE_ANON =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5YWNrbW5qaHNkbGxmcXF4dW5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MDA0MDgsImV4cCI6MjA4ODA3NjQwOH0.YJ_U2Ilf2rh5_SmPtezCU37vBK6e0qJ1mfYqF71Aw4A";
// mesmo app: links internos
const LP_BASE = process.env.NEXT_PUBLIC_LP_BASE_URL || "";

/** Curso no formato usado pelos cards do site (mesmo shape do COURSES estático) */
export interface SiteCourse {
  id: string;
  title: string;
  area: string;
  modality: string;
  city: string;
  location: string;
  date: string;
  month: string;
  workload: string;
  professor: string;
  description: string;
  audiences: string[];
  image: string;
  url: string;
  /** ISO da próxima turma aberta (ordenação); null se sem turma */
  startDate: string | null;
  /** curso | seminario | congresso — seminários/congressos entram também no banner da home */
  tipo: string;
  /** Imagem larga para o banner da home (seminários/congressos) */
  bannerImage: string;
  /** true quando o curso tem capa própria (a arte já contém título/data — o card não sobrepõe texto) */
  hasCover: boolean;
  /** true quando o banner é arte pronta (home mostra só a imagem clicável, sem textos) */
  hasBannerArt: boolean;
  /** link externo do banner (ex.: site próprio do seminário); vazio = página interna */
  bannerLink: string;
  /** marcado no admin para subir ao banner da home mesmo sendo curso comum */
  destaqueHome: boolean;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1577985043696-8bd54d9f093f?q=80&w=2070&auto=format&fit=crop";

const MODALITY_LABEL: Record<string, string> = {
  presencial: "Presencial",
  online: "Online",
  hibrido: "Presencial e Online",
};

/* eslint-disable @typescript-eslint/no-explicit-any */

async function rest(path: string): Promise<any[]> {
  if (!SUPABASE_ANON) return [];
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: {
        apikey: SUPABASE_ANON,
        Authorization: `Bearer ${SUPABASE_ANON}`,
      },
      // revalida a cada 5 min — curso cadastrado no admin aparece sozinho
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

/**
 * Esferas de atuação (AUDIENCES) que o curso atende, derivadas do público-alvo
 * cadastrado no admin. Alimenta o filtro por órgão da vitrine da home.
 */
function audiencesFromCards(cards: any[], nucleo: string): string[] {
  const texto = [
    ...(cards || []).map((c) => `${c?.title || ""} ${c?.description || ""}`),
    nucleo,
  ]
    .join(" ")
    .toLowerCase();

  const set = new Set<string>();
  const marca = (cond: boolean, esfera: string) => cond && set.add(esfera);

  marca(/vereador|c[âa]mara|parlamentar|legislativ|assessor/.test(texto), "Legislativo");
  marca(/prefeit|munic[íi]p|c[âa]mara|vereador|secretaria municipal/.test(texto), "Municípios");
  marca(/controle interno|auditor|tribunal de contas|tce|tcu|controladoria|fiscaliza/.test(texto), "Órgãos de Controle");
  marca(/estatal|empresa p[úu]blica|sociedade de economia mista/.test(texto), "Estatais");
  marca(/judici[áa]ri|tribunal de justi[çc]a|f[óo]rum/.test(texto), "Judiciário");
  marca(/conselho/.test(texto), "Conselhos");
  marca(
    /[óo]rg[ãa]o|servidor|gestor|administra[çc][ãa]o p[úu]blica|agente de contrata|pregoeir|setor p[úu]blico|federal|estadual/.test(
      texto
    ),
    "Administração Pública"
  );

  // temas transversais (licitação, finanças, gestão de pessoas, tecnologia)
  // valem para qualquer órgão — não só para quem está citado no público-alvo
  const transversal = /licita|contrat|finan|tribut|or[çc]ament|lideran|gest[ãa]o de pessoas|tecnologia|intelig[êe]ncia artificial/.test(
    `${nucleo} ${texto}`.toLowerCase()
  );
  if (transversal) {
    ["Administração Pública", "Órgãos de Controle", "Estatais", "Municípios"].forEach((e) =>
      set.add(e)
    );
  }

  // curso amplo (atende quase todo mundo) entra também como "Todas as esferas"
  if (set.size >= 4) set.add("Todas as esferas");
  if (set.size === 0) set.add("Administração Pública");

  // mantém a ordem oficial das esferas
  const ordem = [
    "Administração Pública",
    "Órgãos de Controle",
    "Municípios",
    "Estatais",
    "Legislativo",
    "Judiciário",
    "Conselhos",
    "Todas as esferas",
  ];
  return ordem.filter((e) => set.has(e));
}

function cityFromVenue(venue: string | null): string {
  if (!venue) return "";
  // nomes de sede tipo "Sede Plenum Brasília" não têm separador — detecta a cidade direto
  if (/bras[ií]lia/i.test(venue)) return "Brasília";
  if (/belo horizonte/i.test(venue)) return "Belo Horizonte";
  if (venue.includes(" - ")) return venue.split(" - ").pop()!.trim();
  return venue.split(",")[0].trim();
}

function monthLabel(iso: string): string {
  const d = new Date(iso);
  const m = d.toLocaleDateString("pt-BR", { month: "long" });
  return `${m.charAt(0).toUpperCase()}${m.slice(1)} ${d.getFullYear()}`;
}

function dateLabel(turma: any): string {
  const label: string = turma.label || "";
  // usa o label se parecer uma data ("04 a 07 de agosto de 2026"); senão formata
  if (label && /\d/.test(label) && label.length > 8) return label;
  const ini = new Date(turma.start_date);
  const fim = turma.end_date ? new Date(turma.end_date) : null;
  const fmt = (d: Date) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  return fim ? `${fmt(ini)} a ${fmt(fim)}` : fmt(ini);
}

export async function fetchSiteCourses(): Promise<SiteCourse[]> {
  const [courses, dates, instructors] = await Promise.all([
    rest(
      "courses?status=eq.published&select=id,slug,title,subtitle,modality,nucleo,workload,tipo,banner_image_url,cover_image_url,og_image_url,background_image_url,section_backgrounds,audience_cards"
    ),
    rest(
      "course_dates?status=eq.open&select=course_id,label,start_date,end_date,location_venue,instructor_ids&order=start_date.asc"
    ),
    rest("instructors?select=id,name"),
  ]);

  const nameById = new Map<string, string>(instructors.map((i: any) => [i.id, i.name]));

  // Turma encerrada sai do ar sozinha: no dia seguinte ao último dia do curso.
  // A regra vive em lib/turma-vigente.ts, compartilhada com a landing page do
  // curso e com o formulário de inscrição.
  const agora = Date.now();
  const vigentes = dates.filter((d: any) => turmaVigente(d, agora));

  // próxima turma vigente de cada curso (as já realizadas foram descartadas acima)
  const turmaByCourse = new Map<string, any>();
  for (const d of vigentes) {
    if (!turmaByCourse.has(d.course_id)) turmaByCourse.set(d.course_id, d);
  }

  const mapped: SiteCourse[] = courses.map((c: any) => {
    const turma = turmaByCourse.get(c.id) || null;
    const city = turma ? cityFromVenue(turma.location_venue) : "";
    const professores: string = turma
      ? ((turma.instructor_ids || []) as string[])
          .map((id) => nameById.get(id))
          .filter((n) => n && n !== "A definir")
          .join(" e ")
      : "";

    return {
      id: c.id,
      title: c.title,
      area: c.nucleo || "",
      modality: MODALITY_LABEL[c.modality] || c.modality || "Presencial",
      city,
      location: city ? `${city} | ${city === "Brasília" ? "DF" : "MG"}` : "Em breve",
      date: turma ? dateLabel(turma) : "Em breve",
      month: turma ? monthLabel(turma.start_date) : "A definir",
      workload: c.workload || "",
      professor: professores || "Equipe Plenum",
      description: c.subtitle || "",
      audiences: audiencesFromCards(c.audience_cards, c.nucleo || ""),
      image: c.cover_image_url || c.og_image_url || c.background_image_url || FALLBACK_IMAGE,
      url:
        (c.section_backgrounds && c.section_backgrounds.banner_link) ||
        `${LP_BASE}/cursos/${c.slug}`,
      startDate: turma ? turma.start_date : null,
      tipo: c.tipo || "curso",
      hasCover: !!c.cover_image_url,
      hasBannerArt: !!c.banner_image_url,
      bannerLink: (c.section_backgrounds && c.section_backgrounds.banner_link) || "",
      destaqueHome: !!(c.section_backgrounds && c.section_backgrounds.destaque_home),
      bannerImage:
        c.banner_image_url || c.cover_image_url || c.background_image_url || c.og_image_url || FALLBACK_IMAGE,
    };
  });

  // curso sem nenhuma turma vigente não aparece no site
  const comTurma = mapped.filter((c) => c.startDate);

  // próximos primeiro; sem turma no fim
  comTurma.sort((a, b) => {
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  return comTurma;
}

/**
 * Banner/carrossel da home: seminários e congressos com turma aberta, mais os
 * cursos marcados como destaque no admin (section_backgrounds.destaque_home).
 * Os destaques vêm primeiro. Sem nada aqui, a home não mostra a seção — o
 * banner nunca exibe evento que a Plenum não tem.
 */
export async function fetchHomeBanner(limit = 5): Promise<SiteCourse[]> {
  const all = await fetchSiteCourses();
  const naVitrine = all.filter(
    (c) => c.destaqueHome || c.tipo === "seminario" || c.tipo === "congresso"
  );
  // destaque manda no topo; o resto segue a ordem cronológica que já vinha
  naVitrine.sort((a, b) => Number(b.destaqueHome) - Number(a.destaqueHome));
  return naVitrine.slice(0, limit);
}
