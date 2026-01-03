import { HeroSection } from '@/components/sections/HeroSection';
import { ContentSection } from '@/components/sections/ContentSection';
import { CTASection } from '@/components/sections/CTASection';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Camera, Users, Briefcase, Star } from 'lucide-react';

const Services = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <HeroSection
        title="Our Services"
        subtitle="Comprehensive solutions for models, agencies, and brands"
        backgroundImage="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4"
        ctaText="Get Started"
        ctaLink="/auth"
      />

      <ContentSection
        title="What We Offer"
        description="Professional services tailored to every stage of your modeling career or campaign"
      >
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-background border border-border rounded-lg p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-3">Model Management</h3>
            <p className="text-muted-foreground mb-4">
              Full-service representation including portfolio development, career guidance, 
              and booking management for aspiring and established models.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Portfolio consultation</li>
              <li>• Career development</li>
              <li>• Contract negotiation</li>
              <li>• Professional networking</li>
            </ul>
          </div>

          <div className="bg-background border border-border rounded-lg p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Camera className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-3">Casting Services</h3>
            <p className="text-muted-foreground mb-4">
              Professional casting solutions for brands, agencies, and production companies 
              seeking the perfect talent for their projects.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Talent scouting</li>
              <li>• Casting call management</li>
              <li>• Model selection</li>
              <li>• Project coordination</li>
            </ul>
          </div>

          <div className="bg-background border border-border rounded-lg p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-3">Agency Solutions</h3>
            <p className="text-muted-foreground mb-4">
              Comprehensive platform for agencies to manage their roster, bookings, 
              and client relationships all in one place.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Roster management</li>
              <li>• Booking coordination</li>
              <li>• Financial tracking</li>
              <li>• Client portal access</li>
            </ul>
          </div>

          <div className="bg-background border border-border rounded-lg p-8 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Star className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-xl mb-3">Brand Partnerships</h3>
            <p className="text-muted-foreground mb-4">
              Strategic partnerships and campaign management services for brands 
              looking to collaborate with top modeling talent.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Campaign planning</li>
              <li>• Talent matching</li>
              <li>• Budget management</li>
              <li>• Performance analytics</li>
            </ul>
          </div>
        </div>
      </ContentSection>

      <ContentSection
        title="Why Choose GSModeling"
        description="Industry-leading platform backed by years of expertise"
        className="bg-muted/30"
      >
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">15+</div>
            <p className="text-muted-foreground">Years of Experience</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
            <p className="text-muted-foreground">Models Represented</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <p className="text-muted-foreground">Partner Agencies</p>
          </div>
        </div>
      </ContentSection>

      <CTASection
        title="Ready to Get Started?"
        description="Join thousands of models, agencies, and brands using our platform"
        primaryCTA={{ text: "Sign Up Now", link: "/auth" }}
        secondaryCTA={{ text: "Contact Sales", link: "/company/contact" }}
      />

      <Footer />
    </div>
  );
};

export default Services;