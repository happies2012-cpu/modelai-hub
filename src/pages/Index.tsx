import { Navbar } from '@/components/Navbar';
import { HeroCarousel } from '@/components/HeroCarousel';
import { FeaturedModels } from '@/components/FeaturedModels';
import { Stats } from '@/components/Stats';
import { Features } from '@/components/Features';
import { Footer } from '@/components/Footer';
import { SeedDatabaseButton } from '@/components/SeedDatabaseButton';
import { AdminSetupButton } from '@/components/AdminSetupButton';
import { AIChat } from '@/components/AIChat';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroCarousel />
      <div className="container mx-auto px-6 py-8 flex justify-center gap-4">
        <SeedDatabaseButton />
        <AdminSetupButton />
      </div>
      <FeaturedModels />
      <Stats />
      <Features />
      <Footer />
      <AIChat />
    </div>
  );
};

export default Index;
