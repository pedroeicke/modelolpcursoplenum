import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  CourseData,
  CourseDateData,
  InstructorData,
  DesignSystemData,
  CompanyData,
} from './types';

export interface PdfDataResult {
  course: CourseData;
  courseDate: CourseDateData;
  instructors: InstructorData[];
  ds: DesignSystemData;
  company: CompanyData;
}

/**
 * Fetch all data needed to generate the PDF.
 * Uses the authenticated browser Supabase client.
 */
export async function fetchPdfData(
  courseId: string,
  courseDateId: string,
  supabase: SupabaseClient,
): Promise<PdfDataResult> {
  // Fetch course
  const { data: course, error: courseErr } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single();

  if (courseErr || !course) {
    throw new Error(`Curso não encontrado: ${courseErr?.message || courseId}`);
  }

  // Fetch course date (turma)
  const { data: courseDate, error: dateErr } = await supabase
    .from('course_dates')
    .select('*')
    .eq('id', courseDateId)
    .single();

  if (dateErr || !courseDate) {
    throw new Error(`Turma não encontrada: ${dateErr?.message || courseDateId}`);
  }

  // Fetch instructors
  const instructorIds: string[] = courseDate.instructor_ids || [];
  let instructors: InstructorData[] = [];
  if (instructorIds.length > 0) {
    const { data: instructorRows } = await supabase
      .from('instructors')
      .select('id, name, role, bio, photo_url')
      .in('id', instructorIds);
    instructors = (instructorRows || []) as InstructorData[];
  }

  // Fetch design system
  let ds: DesignSystemData | null = null;
  if (course.design_system_id) {
    const { data: dsRow } = await supabase
      .from('design_systems')
      .select('*')
      .eq('id', course.design_system_id)
      .single();
    ds = dsRow as DesignSystemData;
  }

  if (!ds) {
    const { data: dsRow } = await supabase
      .from('design_systems')
      .select('*')
      .eq('is_default', true)
      .single();
    ds = dsRow as DesignSystemData;
  }

  if (!ds) throw new Error('Design system não encontrado');

  // DS-level frames: use ds.hero_frames_path if present (from DB column),
  // otherwise fall back to a known mapping by DS name.
  const DS_FRAMES_MAP: Record<string, { path: string; ext: string }> = {
    'Verde Esmeralda': {
      path: 'https://jyackmnjhsdllfqqxund.supabase.co/storage/v1/object/public/course-covers/frames/gestao-de-projetos-do-zero-ao-avancado/frame_',
      ext: '.jpg',
    },
    'Azul Original': {
      path: '/frames/frame_',
      ext: '.jpg',
    },
  };

  const dsFrames = ds.hero_frames_path
    ? { path: ds.hero_frames_path, ext: ds.hero_frame_ext || '.jpg' }
    : DS_FRAMES_MAP[ds.name] || null;

  if (dsFrames) {
    console.log(`[PDF Data] Using DS frames: "${dsFrames.path}"`);
    course.hero_frames_path = dsFrames.path;
    course.hero_frame_ext = dsFrames.ext;
  }

  // Debug: log DS and course frame data
  console.log(`[PDF Data] Course: "${course.title}" (${course.id})`);
  console.log(`[PDF Data] DS id=${course.design_system_id}, name="${ds.name}"`);
  console.log(`[PDF Data] DS color_primary="${ds.color_primary}", color_background="${ds.color_background}"`);
  console.log(`[PDF Data] DS hero_frames_path="${ds.hero_frames_path}"`);
  console.log(`[PDF Data] Final hero_frames_path="${course.hero_frames_path}", hero_frame_ext="${course.hero_frame_ext}"`);

  // Fetch company settings
  const { data: companyRow } = await supabase
    .from('company_settings')
    .select('*')
    .limit(1)
    .single();

  const company: CompanyData = companyRow || {
    company_name: 'Instituto Plenum Brasil',
    logo_url: null,
    logo_dark_url: null,
    phones: [],
    emails: [],
    website: null,
    address: null,
  };

  return {
    course: course as CourseData,
    courseDate: courseDate as CourseDateData,
    instructors,
    ds,
    company: company as CompanyData,
  };
}
