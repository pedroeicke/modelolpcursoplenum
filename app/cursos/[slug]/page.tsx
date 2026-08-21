import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getCourseBySlug, getPublishedCourses } from '@/lib/queries/courses';
import { getCompanySettings } from '@/lib/queries/company';
import { getShaderColors } from '@/lib/design-system';

import DesignSystemProvider from '@/components/dynamic/DesignSystemProvider';
import TurmaProvider from '@/components/dynamic/TurmaProvider';
import Header from '@/components/dynamic/Header';
import Hero from '@/components/dynamic/Hero';
import About from '@/components/dynamic/About';
import TargetAudience from '@/components/dynamic/TargetAudience';
import Stats from '@/components/dynamic/Stats';
import Program from '@/components/dynamic/Program';
import Teachers from '@/components/dynamic/Teachers';
import WorkloadPayment from '@/components/dynamic/WorkloadPayment';
import FolderForm from '@/components/dynamic/FolderForm';
import Location from '@/components/dynamic/Location';
import SocialProof from '@/components/dynamic/SocialProof';
import Relevance from '@/components/dynamic/Relevance';
import GeneralInfo from '@/components/dynamic/GeneralInfo';
import Footer from '@/components/dynamic/Footer';
import { turmaVigente } from '@/lib/turma-vigente';

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
  const [course, company] = await Promise.all([
    getCourseBySlug(slug),
    getCompanySettings(),
  ]);

  if (!course || course.status !== 'published') {
    notFound();
  }

  // Evento com site próprio (ex.: seminário): a página interna não existe — vai direto pro site
  const externalSite = (course.section_backgrounds as Record<string, string> | null)?.banner_link;
  if (externalSite) {
    redirect(externalSite);
  }

  // Nenhuma turma vigente = o curso já aconteceu. A página continua no ar (o
  // Google e os links antigos apontam para ela), mas para de vender: o botão
  // deixa de levar à inscrição e passa a captar interesse na próxima turma.
  const encerrado =
    !!course.dates?.length && !course.dates.some((d) => turmaVigente(d));

  const heroBadges = encerrado
    ? (course.hero_badges || []).map((b) =>
        b.value === 'dropdown' ? { ...b, label: 'Turma', value: 'Encerrada' } : b
      )
    : course.hero_badges;

  const designSystem = course.design_system;
  if (!designSystem) {
    notFound();
  }

  // Derive shader colors from design system
  const shaderColors = getShaderColors(designSystem);

  // Build dynamic nav items based on course content
  const navItems: Array<{ label: string; href: string }> = [];
  if (course.about_cards?.length > 0) navItems.push({ label: 'Diferenciais', href: '#diferenciais' });
  if (course.audience_cards?.length > 0) navItems.push({ label: 'Público-Alvo', href: '#publico' });
  if (course.relevance_paragraphs?.length > 0) navItems.push({ label: 'Relevância', href: '#relevancia' });
  navItems.push({ label: 'Programação', href: '#programacao' });
  // Determine instructor label from actual data
  const totalInstructors = course.dates?.reduce((acc, d) => acc + (d.instructors?.length || 0), 0) || 0;
  navItems.push({ label: totalInstructors === 1 ? 'Instrutor' : 'Instrutores', href: '#instrutor' });
  navItems.push({ label: 'Investimento', href: '#investimento' });
  navItems.push({ label: 'Material', href: '#folder' });
  if (course.modality !== 'online') navItems.push({ label: 'Local', href: '#local' });
  if (course.general_info_items?.length > 0) navItems.push({ label: 'Informações', href: '#informacoes-gerais' });

  // Build WhatsApp URL
  const whatsappUrl = course.whatsapp_number
    ? `https://wa.me/${course.whatsapp_number.replace(/\D/g, '')}${course.whatsapp_message ? `?text=${encodeURIComponent(course.whatsapp_message)}` : ''}`
    : 'https://wa.me/553125311776';

  return (
    <DesignSystemProvider designSystem={designSystem}>
      <TurmaProvider dates={course.dates} heroBadges={heroBadges}>
        <main className="min-h-screen w-full flex flex-col relative" style={{ backgroundColor: 'var(--ds-background)' }}>
          <Header
            logoUrl={company.logo_url || '/logo-plenum-aberta2.png'}
            logoDarkUrl={company.logo_dark_url || '/logo.svg'}
            navItems={navItems}
            ctaText={encerrado ? 'Próxima turma' : 'Quero me inscrever'}
            ctaHref={encerrado ? '#notificacao' : '#inscricao'}
          />

          <Hero
            title={course.title}
            subtitle={course.subtitle}
            categoryLabel={course.category_label}
            titleParts={course.title_parts}
            framesPath={course.hero_frames_path || designSystem.hero_frames_path}
            frameCount={course.hero_frame_count || designSystem.hero_frame_count}
            frameExt={course.hero_frame_ext || designSystem.hero_frame_ext}
            folderPdfUrl={course.folder_pdf_url}
            ctaText={encerrado ? 'Avise-me sobre a próxima turma' : 'Quero me inscrever'}
            ctaHref={encerrado ? '#notificacao' : undefined}
          />

          <About
            cards={course.about_cards}
            heading={course.about_heading || undefined}
            subheading={course.about_subheading || undefined}
          />

          <TargetAudience
            audiences={course.audience_cards}
            cells={course.audience_images?.map((img, i) => ({
              src: img.url,
              xDir: i === 0 ? -1 : i <= 2 ? 1 : i === 3 ? -1 : 0,
              yDir: i <= 1 ? -1 : 1,
              sizes: i === 0 ? '75vw' : i <= 2 ? '25vw' : '37vw',
            })) || []}
          />

          <div className="mt-[100px]" />

          {course.relevance_paragraphs && course.relevance_paragraphs.length > 0 && (
            <Relevance paragraphs={course.relevance_paragraphs} />
          )}

          <Stats logos={course.partner_logos} />

          <Program
            heading={course.program_heading || undefined}
            description={course.program_description || undefined}
            shaderColors={shaderColors.colorbends}
          />

          {/* Blur transition between Program and Teachers */}
          <div className="relative h-0 overflow-visible pointer-events-none z-20">
            <div
              className="absolute inset-x-0 -top-16 h-32 backdrop-blur-2xl"
              style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%, black 60%, transparent 100%)' }}
            />
          </div>

          <Teachers />

          <WorkloadPayment
            heading={course.investment_heading || undefined}
            subtitle={course.investment_subtitle || undefined}
            items={course.included_items}
            whatsappUrl={whatsappUrl}
            ctaText="Falar com Consultor"
            backgroundImageUrl={course.background_image_url || undefined}
            productImageUrl={course.product_image_url || undefined}
            price={course.price}
            modality={course.modality}
            prices={course.section_backgrounds?.precos}
          />

          <FolderForm
            courseId={course.id}
            pdfUrl={course.folder_pdf_url}
            backgroundImageUrl={course.section_backgrounds?.folder || undefined}
          />

          {/* Location — only render for presencial/hibrido (visibility handled by component via context) */}
          {course.modality !== 'online' && (
            <Location
              phones={company.phones}
            />
          )}

          <SocialProof
            testimonials={course.testimonials}
            company={company}
            courseId={course.id}
            whatsappUrl={whatsappUrl}
            grainientColors={shaderColors.grainient}
          />

          {course.general_info_items && course.general_info_items.length > 0 && (
            <GeneralInfo items={course.general_info_items} />
          )}

          <Footer
            company={company}
            logoUrl={company.logo_url || '/logo-plenum-aberta2.png'}
            encerrado={encerrado}
          />

        </main>
      </TurmaProvider>
    </DesignSystemProvider>
  );
}
