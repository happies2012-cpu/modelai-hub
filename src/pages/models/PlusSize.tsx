import { HeroSection } from '@/components/sections/HeroSection';
import { ContentSection } from '@/components/sections/ContentSection';
import { CTASection } from '@/components/sections/CTASection';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const PlusSize = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <HeroSection
        title="Plus Size Models"
        subtitle="Celebrating diverse beauty and body positivity"
        backgroundImage="https://images.unsplash.com/photo-1494774157365-9e04c6720e47"
        ctaText="Explore Talent"
        ctaLink="#plus-size-models"
      />

      <ContentSection
        title="Inclusive Representation"
        description="Professional plus size models for fashion, editorial, and commercial work"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[3/4] bg-muted rounded-lg mb-2 overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-${1495000000000 + i * 105000000}?w=400&h=600&fit=crop`}
                  alt={`Plus size model ${i}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-sm font-medium">Model {i}</p>
              <p className="text-xs text-muted-foreground">Size 12-18</p>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection
        title="Breaking Barriers"
        description="Leading the movement for body inclusivity in fashion"
        className="bg-muted/30"
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-muted-foreground mb-8">
            Our plus size models are breaking stereotypes and redefining beauty standards 
            in the fashion industry. They represent brands that celebrate diversity and authenticity.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-background p-6 rounded-lg">
              <h3 className="text-3xl font-bold text-primary mb-2">500+</h3>
              <p className="text-muted-foreground">Campaigns</p>
            </div>
            <div className="bg-background p-6 rounded-lg">
              <h3 className="text-3xl font-bold text-primary mb-2">150+</h3>
              <p className="text-muted-foreground">Magazine Features</p>
            </div>
            <div className="bg-background p-6 rounded-lg">
              <h3 className="text-3xl font-bold text-primary mb-2">50+</h3>
              <p className="text-muted-foreground">Runway Shows</p>
            </div>
          </div>
        </div>
      </ContentSection>

      <CTASection
        title="Book Plus Size Models"
        description="Authentic, confident talent for your inclusive campaigns"
        primaryCTA={{ text: "View Portfolio", link: "/models" }}
        secondaryCTA={{ text: "Contact Agency", link: "/agencies" }}
      />

      <Footer />
    </div>
  );
};

export default PlusSize;