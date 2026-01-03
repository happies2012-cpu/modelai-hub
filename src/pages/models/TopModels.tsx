import { HeroSection } from '@/components/sections/HeroSection';
import { ContentSection } from '@/components/sections/ContentSection';
import { CTASection } from '@/components/sections/CTASection';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Star } from 'lucide-react';

const TopModels = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection
        title="Top Models"
        subtitle="Elite talent shaping the fashion industry"
        backgroundImage="https://images.unsplash.com/photo-1483985988355-763728e1935b"
        ctaText="Book Top Talent"
        ctaLink="#top-talent"
      />

      {/* Section A: Featured Top Models */}
      <ContentSection
        title="Industry Leaders"
        description="Our most experienced and sought-after models"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative aspect-[3/4] bg-muted rounded-lg mb-4 overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-${1500000000000 + i * 150000000}?w=500&h=700&fit=crop`}
                  alt={`Top model ${i}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-gold text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                  <Star className="h-3 w-3 fill-current" />
                  Top Model
                </div>
              </div>
              <h3 className="font-semibold text-lg">Elite Model {i}</h3>
              <p className="text-sm text-muted-foreground">5'10" | 15+ years experience</p>
              <p className="text-sm text-gold mt-1">Vogue, Elle, Harper's Bazaar</p>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* Section B: Achievements */}
      <ContentSection
        title="Award-Winning Talent"
        description="Recognized excellence in the modeling industry"
        className="bg-muted/30"
      >
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="text-center p-6 bg-background rounded-lg">
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <p className="text-muted-foreground">Magazine Covers</p>
          </div>
          <div className="text-center p-6 bg-background rounded-lg">
            <div className="text-4xl font-bold text-primary mb-2">150+</div>
            <p className="text-muted-foreground">Runway Shows</p>
          </div>
          <div className="text-center p-6 bg-background rounded-lg">
            <div className="text-4xl font-bold text-primary mb-2">75+</div>
            <p className="text-muted-foreground">Brand Campaigns</p>
          </div>
          <div className="text-center p-6 bg-background rounded-lg">
            <div className="text-4xl font-bold text-primary mb-2">25+</div>
            <p className="text-muted-foreground">Industry Awards</p>
          </div>
        </div>
      </ContentSection>

      {/* Section C: CTA */}
      <CTASection
        title="Work with the Best"
        description="Book our top models for your next campaign or event"
        primaryCTA={{ text: "Request Booking", link: "/auth" }}
        secondaryCTA={{ text: "View All Models", link: "/models" }}
      />

      <Footer />
    </div>
  );
};

export default TopModels;