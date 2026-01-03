import { HeroSection } from '@/components/sections/HeroSection';
import { ContentSection } from '@/components/sections/ContentSection';
import { CTASection } from '@/components/sections/CTASection';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const Editorial = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <HeroSection
        title="Editorial Models"
        subtitle="Artistic expression meets high fashion photography"
        backgroundImage="https://images.unsplash.com/photo-1509631179647-0177331693ae"
        ctaText="Explore Portfolios"
        ctaLink="#editorial-work"
      />

      <ContentSection
        title="Magazine & Campaign Experts"
        description="Models who excel in creating compelling visual narratives"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[4/5] bg-muted rounded-lg mb-3 overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-${1490000000000 + i * 110000000}?w=500&h=625&fit=crop`}
                  alt={`Editorial model ${i}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold">Editorial Specialist {i}</h3>
              <p className="text-sm text-muted-foreground">Vogue | Elle | Harper's</p>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection
        title="Published Work"
        description="Featured in leading fashion publications worldwide"
        className="bg-muted/30"
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {['Vogue', 'Elle', "Harper's Bazaar", 'Marie Claire', 'W Magazine'].map((mag) => (
            <div key={mag} className="bg-background p-6 rounded-lg text-center">
              <p className="font-serif text-xl font-bold">{mag}</p>
            </div>
          ))}
        </div>
      </ContentSection>

      <CTASection
        title="Book Editorial Models"
        description="Perfect for fashion editorials, magazine covers, and artistic campaigns"
        primaryCTA={{ text: "View Portfolios", link: "/models" }}
        secondaryCTA={{ text: "Contact Agency", link: "/agencies" }}
      />

      <Footer />
    </div>
  );
};

export default Editorial;