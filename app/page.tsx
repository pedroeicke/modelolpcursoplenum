import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import TargetAudience from '@/components/TargetAudience';
import Stats from '@/components/Stats';
import Program from '@/components/Program';
import Teachers from '@/components/Teachers';
import WorkloadPayment from '@/components/WorkloadPayment';
import FolderForm from '@/components/FolderForm';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col relative bg-[#030d1f]">
      <Header />
      <Hero />
      <About />
      <TargetAudience />
      <div className="mt-[100px]" />
      <Stats />
      <div className="relative">
        <Program />
        <div className="sticky top-0 z-20">
          <Teachers />
        </div>
      </div>
      <WorkloadPayment />
<FolderForm />
      <Footer />
    </main>
  );
}
