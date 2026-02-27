import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Program from '@/components/Program';
import Teachers from '@/components/Teachers';
import FolderForm from '@/components/FolderForm';
import Location from '@/components/Location';
import WorkloadPayment from '@/components/WorkloadPayment';
import EnrollCTA from '@/components/EnrollCTA';
import Testimonials from '@/components/Testimonials';
import CancellationPolicy from '@/components/CancellationPolicy';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col relative overflow-hidden bg-[#030d1f]">
      <Header />
      <Hero />
      <About />
      <Program />
      <Teachers />
      <FolderForm />
      <Location />
      <WorkloadPayment />
      <EnrollCTA />
      <Testimonials />
      <CancellationPolicy />
      <Footer />
    </main>
  );
}
