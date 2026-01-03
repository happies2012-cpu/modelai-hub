import { HeroSection } from '@/components/sections/HeroSection';
import { ContentSection } from '@/components/sections/ContentSection';
import { CTASection } from '@/components/sections/CTASection';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const NewFaces = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection
        title="New Faces"
        subtitle="Discover the next generation of modeling talent"
        backgroundImage="https://images.unsplash.com/photo-1469334031218-e382a71b716b"
        ctaText="View All New Models"
        ctaLink="#new-models"
      />

      {/* Section A: Featured New Models */}
      <ContentSection
        title="Fresh Talent"
        description="Meet our newest additions to the GSModeling roster"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Placeholder cards - will be populated with real data */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[3/4] bg-muted rounded-lg mb-3 overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-${1500000000000 + i * 100000000}?w=400&h=600&fit=crop`}
                  alt={`New model ${i}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold">Model Name {i}</h3>
              <p className="text-sm text-muted-foreground">Height: 5'9" | New Face</p>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* Section B: What Makes a New Face */}
      <ContentSection
        title="What We Look For"
        description="Our criteria for selecting new talent"
        className="bg-muted/30"
      >
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Unique Look</h3>
            <p className="text-muted-foreground">Distinctive features that stand out in the industry</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💫</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Potential</h3>
            <p className="text-muted-foreground">Natural ability and eagerness to learn</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Professionalism</h3>
            <p className="text-muted-foreground">Dedication and commitment to the craft</p>
          </div>
        </div>
      </ContentSection>

      {/* Section C: CTA */}
      <CTASection
        title="Are You a New Face?"
        description="Join our roster and launch your modeling career with GSModeling"
        primaryCTA={{ text: "Apply Now", link: "/auth" }}
        secondaryCTA={{ text: "Learn More", link: "/agencies" }}
      />

      <Footer />
    </div>
  );
};

export default NewFaces;