import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, Clock } from 'lucide-react';

const positions = [
  {
    title: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    location: 'New York / Remote',
    type: 'Full-time',
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'London / Remote',
    type: 'Full-time',
  },
  {
    title: 'Model Scout - Europe',
    department: 'Talent',
    location: 'Paris',
    type: 'Full-time',
  },
  {
    title: 'Head of Partnerships',
    department: 'Business Development',
    location: 'New York',
    type: 'Full-time',
  },
  {
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
  },
];

const Careers = () => {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container-luxury text-center">
            <span className="text-accent tracking-luxury uppercase text-sm">Join Our Team</span>
            <h1 className="mt-4 mb-6">Build the Future of Fashion</h1>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto">
              We're looking for passionate individuals who want to revolutionize how the 
              fashion industry discovers and works with talent.
            </p>
            <div className="divider-gold mt-8" />
          </div>
        </section>

        {/* Why Join */}
        <section className="section-padding">
          <div className="container-luxury">
            <h2 className="text-center mb-12">Why GSModeling?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Impact', desc: 'Your work directly shapes how thousands of models build their careers.' },
                { title: 'Growth', desc: 'Rapid career advancement in a fast-growing startup environment.' },
                { title: 'Culture', desc: 'Diverse, inclusive team with a passion for fashion and technology.' },
              ].map((item) => (
                <div key={item.title} className="text-center p-8 border border-border/50">
                  <h3 className="font-display text-xl mb-4">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="section-padding bg-secondary/30">
          <div className="container-luxury">
            <h2 className="text-center mb-12">Open Positions</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {positions.map((position) => (
                <div 
                  key={position.title}
                  className="bg-card border border-border/50 p-6 hover:border-accent/50 transition-smooth"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-display text-lg">{position.title}</h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {position.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {position.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {position.type}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" className="shrink-0">
                      Apply Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding">
          <div className="container-luxury text-center">
            <h2 className="mb-4">Don't See Your Role?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              We're always looking for exceptional talent. Send us your resume and 
              tell us how you can contribute to our mission.
            </p>
            <Button className="btn-luxury">
              <span>Send Your Resume</span>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Careers;
