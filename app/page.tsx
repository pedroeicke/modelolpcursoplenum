import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Events from "@/components/sections/Events";
import Academy from "@/components/sections/Academy";
import SocialProof from "@/components/sections/SocialProof";
import GovTechHome from "@/components/sections/GovTechHome";
import EducaPublicaHome from "@/components/sections/EducaPublicaHome";
import Consultoria from "@/components/sections/Consultoria";
import AlumniHome from "@/components/sections/AlumniHome";
import Blog from "@/components/sections/Blog";
import Instagram from "@/components/sections/Instagram";
import Enderecos from "@/components/sections/Enderecos";
import WhatsappFinal from "@/components/sections/WhatsappFinal";
import Footer from "@/components/sections/Footer";
import WhatsAppFloat from "@/components/sections/WhatsAppFloat";
import { getInstagramPosts } from "@/lib/instagram";
import { fetchSiteCourses, fetchUpcomingSeminars } from "@/lib/courses-db";

export const revalidate = 300;

export default async function Home() {
  const instagramPosts = await getInstagramPosts();

  // Cursos reais (ordenados pela turma mais próxima) → vitrine da Academy
  const courses = await fetchSiteCourses();

  // Seminários e congressos com turma aberta (cadastrados no admin) → banner
  const seminars = await fetchUpcomingSeminars(5);
  const homeEvents = seminars.map((c) => ({
    id: c.id,
    title: c.title,
    badge: [c.tipo === "congresso" ? "Congresso" : "Seminário", c.month]
      .filter(Boolean)
      .join(" · ")
      .toUpperCase(),
    description: c.description || `${c.date} · ${c.location}`,
    image: c.bannerImage,
    url: c.url,
  }));

  return (
    <main className="plenum-site text-[#030D1F] overflow-x-hidden">
      <Header />
      <Hero />

      <div className="relative z-[5] bg-[#F1F1F1]">
        <Events events={homeEvents} />
        <Academy courses={courses} />
        <SocialProof />
        <GovTechHome />
        <EducaPublicaHome />
        <Consultoria />
        <AlumniHome />
        <Blog />
        <Instagram posts={instagramPosts} />
        <Enderecos />
        <WhatsappFinal />
        <Footer />
      </div>
      <WhatsAppFloat />
    </main>
  );
}
