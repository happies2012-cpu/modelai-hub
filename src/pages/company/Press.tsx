import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';

const pressReleases = [
  {
    date: 'November 2024',
    title: 'GSModeling Raises $50M Series B to Expand Global Operations',
    source: 'TechCrunch',
  },
  {
    date: 'October 2024',
    title: 'How GSModeling is Changing Fashion Casting Forever',
    source: 'Vogue Business',
  },
  {
    date: 'September 2024',
    title: 'GSModeling Partners with Top 10 Global Agencies',
    source: 'WWD',
  },
];

const Press = () => {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container-luxury text-center">
            <span className="text-accent tracking-luxury uppercase text-sm">Media Resources</span>
            <h1 className="mt-4 mb-6">Press Kit</h1>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto">
              Everything you need to cover GSModeling. Download assets, read our story, 
              and connect with our communications team.
            </p>
            <div className="divider-gold mt-8" />
          </div>
        </section>

        {/* Brand Assets */}
        <section className="section-padding">
          <div className="container-luxury">
            <h2 className="text-center mb-12">Brand Assets</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Logo Pack', desc: 'PNG, SVG, and EPS formats in various colors' },
                { title: 'Brand Guidelines', desc: 'Typography, colors, and usage rules' },
                { title: 'Product Screenshots', desc: 'High-resolution app and platform images' },
              ].map((asset) => (
                <div key={asset.title} className="p-8 border border-border/50 text-center">
                  <h3 className="font-display text-lg mb-2">{asset.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6">{asset.desc}</p>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Coverage */}
        <section className="section-padding bg-secondary/30">
          <div className="container-luxury">
            <h2 className="text-center mb-12">Recent Coverage</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {pressReleases.map((item) => (
                <div 
                  key={item.title}
                  className="bg-card border border-border/50 p-6 hover:border-accent/50 transition-smooth group cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        {item.date} • {item.source}
                      </span>
                      <h3 className="font-display text-lg mt-2 group-hover:text-accent transition-smooth">
                        {item.title}
                      </h3>
                    </div>
                    <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-smooth shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="section-padding">
          <div className="container-luxury text-center max-w-2xl">
            <h2 className="mb-4">Media Inquiries</h2>
            <p className="text-muted-foreground mb-8">
              For press inquiries, interview requests, or additional information, 
              please contact our communications team.
            </p>
            <div className="p-8 border border-border/50">
              <p className="font-display text-lg">Press Contact</p>
              <a href="mailto:press@gsmodeling.com" className="text-accent hover:underline">
                press@gsmodeling.com
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Press;
