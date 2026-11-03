import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Qualifications from '@/components/landing/Qualifications';
import PipelineSection from '@/components/landing/PipelineSection';
import Footer from '@/components/landing/Footer';
import DemoSection from '@/components/demo/DemoSection';

function App() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      <Navbar />
      <main>
        <Hero />
        <Qualifications />
        <PipelineSection />
        <DemoSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
