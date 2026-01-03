import { HeroSection } from '@/components/sections/HeroSection';
import { ContentSection } from '@/components/sections/ContentSection';
import { CTASection } from '@/components/sections/CTASection';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const Commercial = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <HeroSection
        title="Commercial Models"
        subtitle="Relatable faces for brands and advertising campaigns"
        backgroundImage="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f"
        ctaText="Find Your Perfect Match"
        ctaLink="#commercial-roster"
      />

      <ContentSection
        title="Diverse Commercial Talent"
        description="Models who connect with audiences across all demographics"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-square bg-muted rounded-lg mb-2 overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-${1470000000000 + i * 125000000}?w=400&h=400&fit=crop`}
                  alt={`Commercial model ${i}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-sm font-medium">Model {i}</p>
              <p className="text-xs text-muted-foreground">All heights | All ages</p>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection
        title="Perfect for All Industries"
        description="Our commercial models work across diverse sectors"
        className="bg-muted/30"
      >
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="text-center p-6 bg-background rounded-lg">
            <div className="text-3xl mb-2">🛍️</div>
            <h3 className="font-semibold mb-1">Retail</h3>
            <p className="text-sm text-muted-foreground">E-commerce & catalogs</p>
          </div>
          <div className="text-center p-6 bg-background rounded-lg">
            <div className="text-3xl mb-2">💼</div>
            <h3 className="font-semibold mb-1">Corporate</h3>
            <p className="text-sm text-muted-foreground">Business & lifestyle</p>
          </div>
          <div className="text-center p-6 bg-background rounded-lg">
            <div className="text-3xl mb-2">🏋️</div>
            <h3 className="font-semibold mb-1">Fitness</h3>
            <p className="text-sm text-muted-foreground">Activewear & wellness</p>
          </div>
          <div className="text-center p-6 bg-background rounded-lg">
            <div className="text-3xl mb-2">🎨</div>
            <h3 className="font-semibold mb-1">Lifestyle</h3>
            <p className="text-sm text-muted-foreground">Brand storytelling</p>
          </div>
        </div>
      </ContentSection>

      <CTASection
        title="Book Commercial Models"
        description="Authentic, relatable talent for your advertising and marketing needs"
        primaryCTA={{ text: "Browse Talent", link: "/models" }}
        secondaryCTA={{ text: "Request Casting", link: "/casting" }}
      />

      <Footer />
    </div>
  );
};

export default Commercial;