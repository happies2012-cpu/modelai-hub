import { HeroSection } from '@/components/sections/HeroSection';
import { ContentSection } from '@/components/sections/ContentSection';
import { CTASection } from '@/components/sections/CTASection';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const Fashion = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <HeroSection
        title="Fashion Models"
        subtitle="High fashion runway and editorial specialists"
        backgroundImage="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"
        ctaText="View Fashion Portfolio"
        ctaLink="#fashion-models"
      />

      <ContentSection
        title="Haute Couture Specialists"
        description="Models who bring designer visions to life on the runway and in print"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[3/4] bg-muted rounded-lg mb-2 overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-${1480000000000 + i * 120000000}?w=400&h=600&fit=crop`}
                  alt={`Fashion model ${i}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-sm font-medium">Fashion Model {i}</p>
              <p className="text-xs text-muted-foreground">5'9"+ | Runway</p>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection
        title="Fashion Week Experience"
        description="Our models have walked for the world's leading fashion houses"
        className="bg-muted/30"
      >
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
          <div>
            <h3 className="text-2xl font-bold mb-2">Paris Fashion Week</h3>
            <p className="text-muted-foreground">Chanel, Dior, Saint Laurent</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Milan Fashion Week</h3>
            <p className="text-muted-foreground">Prada, Versace, Gucci</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">New York Fashion Week</h3>
            <p className="text-muted-foreground">Marc Jacobs, Michael Kors, Ralph Lauren</p>
          </div>
        </div>
      </ContentSection>

      <CTASection
        title="Book Fashion Models"
        description="Perfect for runway shows, fashion editorials, and luxury brand campaigns"
        primaryCTA={{ text: "Request Availability", link: "/auth" }}
        secondaryCTA={{ text: "View All Categories", link: "/models" }}
      />

      <Footer />
    </div>
  );
};

export default Fashion;