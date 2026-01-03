import { HeroSection } from '@/components/sections/HeroSection';
import { ContentSection } from '@/components/sections/ContentSection';
import { CTASection } from '@/components/sections/CTASection';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const Mature = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <HeroSection
        title="Mature Models"
        subtitle="Experience, elegance, and timeless beauty"
        backgroundImage="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453"
        ctaText="Discover Talent"
        ctaLink="#mature-models"
      />

      <ContentSection
        title="Experienced Professionals"
        description="Mature models bringing sophistication and authenticity to every project"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[3/4] bg-muted rounded-lg mb-3 overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-${1475000000000 + i * 135000000}?w=500&h=700&fit=crop`}
                  alt={`Mature model ${i}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold">Model {i}</h3>
              <p className="text-sm text-muted-foreground">Age 40+ | Professional</p>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection
        title="Redefining Age in Fashion"
        description="Celebrating maturity and sophistication in the modeling industry"
        className="bg-muted/30"
      >
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-muted-foreground text-center mb-8">
            Our mature models bring decades of experience, confidence, and refined elegance 
            to every project. They're perfect for luxury brands, lifestyle campaigns, and 
            projects that value authenticity and sophistication.
          </p>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Luxury Brands</h3>
              <p className="text-sm text-muted-foreground">High-end fashion</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Lifestyle</h3>
              <p className="text-sm text-muted-foreground">Authentic stories</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Beauty</h3>
              <p className="text-sm text-muted-foreground">Skincare & wellness</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Editorial</h3>
              <p className="text-sm text-muted-foreground">Magazine features</p>
            </div>
          </div>
        </div>
      </ContentSection>

      <CTASection
        title="Book Mature Models"
        description="Sophisticated talent for discerning brands and campaigns"
        primaryCTA={{ text: "Browse Portfolio", link: "/models" }}
        secondaryCTA={{ text: "Request Info", link: "/company/contact" }}
      />

      <Footer />
    </div>
  );
};

export default Mature;