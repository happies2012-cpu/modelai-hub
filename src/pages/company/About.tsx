import { HeroSection } from '@/components/sections/HeroSection';
import { ContentSection } from '@/components/sections/ContentSection';
import { CTASection } from '@/components/sections/CTASection';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <HeroSection
        title="About GSModeling"
        subtitle="Revolutionizing the modeling industry since 2010"
        backgroundImage="https://images.unsplash.com/photo-1558618666-fcd25c85cd64"
        ctaText="Join Our Team"
        ctaLink="/company/careers"
      />

      <ContentSection
        title="Our Story"
        description="Building the future of modeling talent management"
      >
        <div className="max-w-4xl mx-auto prose prose-lg">
          <p className="text-muted-foreground leading-relaxed">
            Founded in 2010, GSModeling by Guidesoft has grown from a small boutique agency 
            to one of the industry's leading platforms for connecting models, agencies, and brands. 
            Our mission is to democratize access to modeling opportunities while maintaining the 
            highest standards of professionalism and excellence.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            We believe that every aspiring model deserves a chance to showcase their talent, 
            and every brand deserves access to the perfect talent for their campaigns. Our 
            technology-driven approach combined with industry expertise has helped launch 
            thousands of successful modeling careers.
          </p>
        </div>
      </ContentSection>

      <ContentSection
        title="Our Values"
        description="The principles that guide everything we do"
        className="bg-muted/30"
      >
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Excellence</h3>
            <p className="text-muted-foreground">
              We maintain the highest standards in everything we do, from talent selection to client service.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Integrity</h3>
            <p className="text-muted-foreground">
              Transparency and honesty are at the core of all our relationships and business practices.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌟</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Innovation</h3>
            <p className="text-muted-foreground">
              We continuously evolve our platform and services to meet the changing needs of the industry.
            </p>
          </div>
        </div>
      </ContentSection>

      <CTASection
        title="Join the GSModeling Family"
        description="Whether you're a model, agency, or brand, we're here to help you succeed"
        primaryCTA={{ text: "Get Started", link: "/auth" }}
        secondaryCTA={{ text: "Contact Us", link: "/company/contact" }}
      />

      <Footer />
    </div>
  );
};

export default About;