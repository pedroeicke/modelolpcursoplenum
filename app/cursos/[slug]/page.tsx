import type { Metadata } from 'next';
import { getCourseBySlug, getPublishedCourses } from '@/lib/queries/courses';
import PaginaDoCurso from '@/components/PaginaDoCurso';
import { getCompanySettings } from '@/lib/queries/company';


// ─── ISR ───────────────────────────────────────────────
export const revalidate = 3600; // Revalidate every hour

// ─── Static params (pre-build published courses) ──────
export async function generateStaticParams() {
  const courses = await getPublishedCourses();
  return courses.map((course) => ({ slug: course.slug }));
}

// ─── Dynamic metadata ─────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: 'Curso não encontrado' };

  return {
    title: course.meta_title || `${course.title} | Instituto Plenum Brasil`,
    description: course.meta_description || course.subtitle || '',
    openGraph: {
      title: course.meta_title || course.title,
      description: course.meta_description || course.subtitle || '',
      images: course.og_image_url ? [{ url: course.og_image_url }] : [],
    },
  };
}

// ─── Page ─────────────────────────────────────────────
export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PaginaDoCurso slug={slug} />;
}
