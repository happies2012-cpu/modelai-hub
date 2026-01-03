import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const Mission = () => {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="section-padding bg-primary text-primary-foreground">
          <div className="container-luxury text-center">
            <span className="text-accent tracking-luxury uppercase text-sm">Our Purpose</span>
            <h1 className="mt-4 mb-6">Redefining Fashion's Future</h1>
            <div className="divider-gold mt-8" />
          </div>
        </section>

        {/* Mission Statement */}
        <section className="section-padding">
          <div className="container-luxury max-w-4xl">
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-display mb-6">Our Mission</h2>
                <p className="text-muted-foreground leading-luxury text-lg">
                  GSModeling exists to democratize the fashion industry by connecting extraordinary talent 
                  with visionary brands through innovative technology. We believe every model deserves 
                  fair representation, transparent dealings, and the opportunity to build a sustainable career.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="stat-card text-center">
                  <h3 className="text-4xl font-display text-accent mb-2">10K+</h3>
                  <p className="text-muted-foreground text-sm uppercase tracking-wider">Models Represented</p>
                </div>
                <div className="stat-card text-center">
                  <h3 className="text-4xl font-display text-accent mb-2">500+</h3>
                  <p className="text-muted-foreground text-sm uppercase tracking-wider">Partner Agencies</p>
                </div>
                <div className="stat-card text-center">
                  <h3 className="text-4xl font-display text-accent mb-2">50+</h3>
                  <p className="text-muted-foreground text-sm uppercase tracking-wider">Countries</p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-display mb-6">Our Values</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { title: 'Transparency', desc: 'Clear contracts, fair rates, and honest communication at every step.' },
                    { title: 'Diversity', desc: 'Celebrating beauty in all its forms across ethnicities, ages, and body types.' },
                    { title: 'Innovation', desc: 'Leveraging technology to streamline bookings and maximize opportunities.' },
                    { title: 'Empowerment', desc: 'Giving models control over their careers with data-driven insights.' },
                  ].map((value) => (
                    <div key={value.title} className="p-6 border border-border/50">
                      <h3 className="font-display text-lg mb-2">{value.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{value.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-display mb-6">Our Vision</h2>
                <p className="text-muted-foreground leading-luxury">
                  We envision a fashion industry where talent is discovered based on merit, not just 
                  connections. Where models have complete visibility into their bookings, payments, 
                  and career growth. Where agencies can efficiently manage their rosters and brands 
                  can discover perfect talent in seconds. This is the future we're building.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Mission;
