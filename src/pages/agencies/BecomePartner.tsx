import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { ContentSection } from '@/components/sections/ContentSection';
import { CTASection } from '@/components/sections/CTASection';
import { Check } from 'lucide-react';

const BecomePartner = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <HeroSection
        title="Become a Partner Agency"
        subtitle="Join our network of world-class modeling agencies"
        backgroundImage="https://images.unsplash.com/photo-1497366216548-37526070297c"
        ctaText="Apply Now"
        ctaLink="/auth"
      />

      <ContentSection
        title="Partner Benefits"
        description="Why leading agencies choose GSModeling"
      >
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[
            {
              title: 'Expanded Reach',
              description: 'Access to our global network of clients and brands looking for talent'
            },
            {
              title: 'Booking Management',
              description: 'Streamlined tools to manage your roster and track all bookings'
            },
            {
              title: 'Financial Tools',
              description: 'Integrated payment processing and commission tracking'
            },
            {
              title: 'Marketing Support',
              description: 'Featured placement and promotional opportunities for your models'
            },
            {
              title: 'Industry Insights',
              description: 'Analytics and reporting to help grow your agency business'
            },
            {
              title: 'Dedicated Support',
              description: 'Priority customer service and account management'
            }
          ].map((benefit, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection
        title="Partnership Requirements"
        description="What we look for in our partner agencies"
        className="bg-muted/30"
      >
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="bg-background p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Established Track Record</h3>
            <p className="text-muted-foreground">
              Minimum 2 years of operation with verifiable client references
            </p>
          </div>
          <div className="bg-background p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Professional Standards</h3>
            <p className="text-muted-foreground">
              Commitment to ethical practices and industry best standards
            </p>
          </div>
          <div className="bg-background p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Quality Roster</h3>
            <p className="text-muted-foreground">
              Professional models with current portfolios and availability
            </p>
          </div>
        </div>
      </ContentSection>

      <CTASection
        title="Ready to Partner With Us?"
        description="Join hundreds of agencies already using our platform"
        primaryCTA={{ text: "Submit Application", link: "/auth" }}
        secondaryCTA={{ text: "Learn More", link: "/company/contact" }}
      />

      <Footer />
    </div>
  );
};

export default BecomePartner;