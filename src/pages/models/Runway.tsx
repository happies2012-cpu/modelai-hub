import { HeroSection } from '@/components/sections/HeroSection';
import { ContentSection } from '@/components/sections/ContentSection';
import { CTASection } from '@/components/sections/CTASection';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const Runway = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <HeroSection
        title="Runway Models"
        subtitle="Commanding the catwalk for the world's top fashion shows"
        backgroundImage="https://images.unsplash.com/photo-1558769132-cb1aea3c56d3"
        ctaText="View Runway Portfolio"
        ctaLink="#runway-models"
      />

      <ContentSection
        title="Professional Runway Talent"
        description="Models with the presence and experience to own any runway"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[3/4] bg-muted rounded-lg mb-3 overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-${1485000000000 + i * 140000000}?w=500&h=700&fit=crop`}
                  alt={`Runway model ${i}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold">Runway Pro {i}</h3>
              <p className="text-sm text-muted-foreground">5'10"+ | International</p>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection
        title="Fashion Week Presence"
        description="Our models walk for the world's most prestigious fashion weeks"
        className="bg-muted/30"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
          {['Paris', 'Milan', 'New York', 'London'].map((city) => (
            <div key={city} className="bg-background p-6 rounded-lg">
              <p className="font-serif text-2xl font-bold mb-1">{city}</p>
              <p className="text-sm text-muted-foreground">Fashion Week</p>
            </div>
          ))}
        </div>
      </ContentSection>

      <CTASection
        title="Book Runway Models"
        description="Experienced professionals for your fashion shows and presentations"
        primaryCTA={{ text: "Request Talent", link: "/auth" }}
        secondaryCTA={{ text: "View All Models", link: "/models" }}
      />

      <Footer />
    </div>
  );
};

export default Runway;