// Cursos reais do Supabase (mesmo banco do admin/landing pages).
// Leitura pública (anon key) via REST — cadastrou curso no admin, aparece aqui.

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
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1577985043696-8bd54d9f093f?q=80&w=2070&auto=format&fit=crop";

const MODALITY_LABEL: Record<string, string> = {
  presencial: "Presencial",
  online: "Online",
  hibrido: "Híbrido",
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

function cityFromVenue(venue: string | null): string {
  if (!venue) return "";
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
      "courses?status=eq.published&select=id,slug,title,subtitle,modality,nucleo,workload,tipo,banner_image_url,cover_image_url,og_image_url,background_image_url"
    ),
    rest(
      "course_dates?status=eq.open&select=course_id,label,start_date,end_date,location_venue,instructor_ids&order=start_date.asc"
    ),
    rest("instructors?select=id,name"),
  ]);

  const nameById = new Map<string, string>(instructors.map((i: any) => [i.id, i.name]));

  // primeira turma aberta futura de cada curso (fallback: primeira aberta)
  const now = Date.now();
  const turmaByCourse = new Map<string, any>();
  for (const d of dates) {
    const isFuture = new Date(d.start_date).getTime() >= now;
    const current = turmaByCourse.get(d.course_id);
    if (!current) {
      turmaByCourse.set(d.course_id, d);
    } else {
      const currentFuture = new Date(current.start_date).getTime() >= now;
      if (isFuture && !currentFuture) turmaByCourse.set(d.course_id, d);
    }
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
      audiences: [],
      image: c.cover_image_url || c.og_image_url || c.background_image_url || FALLBACK_IMAGE,
      url: `${LP_BASE}/cursos/${c.slug}`,
      startDate: turma ? turma.start_date : null,
      tipo: c.tipo || "curso",
      hasCover: !!c.cover_image_url,
      bannerImage:
        c.banner_image_url || c.cover_image_url || c.background_image_url || c.og_image_url || FALLBACK_IMAGE,
    };
  });

  // próximos primeiro; sem turma no fim
  mapped.sort((a, b) => {
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  return mapped;
}

/** Seminários e congressos com turma aberta (banner/carrossel da home) */
export async function fetchUpcomingSeminars(limit = 5): Promise<SiteCourse[]> {
  const all = await fetchSiteCourses();
  return all
    .filter((c) => c.startDate && (c.tipo === "seminario" || c.tipo === "congresso"))
    .slice(0, limit);
}
