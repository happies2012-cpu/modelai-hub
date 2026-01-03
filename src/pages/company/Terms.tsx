import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const Terms = () => {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-background">
        <section className="section-padding">
          <div className="container-luxury max-w-4xl">
            <h1 className="text-3xl md:text-4xl mb-4">Terms of Service</h1>
            <p className="text-muted-foreground mb-12">Last updated: December 2024</p>

            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-display mb-4">1. Agreement to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using GSModeling's platform, you agree to be bound by these Terms of Service. 
                  If you disagree with any part of these terms, you may not access the service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display mb-4">2. Use License</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Permission is granted to temporarily access the materials on GSModeling's platform for personal, 
                  non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display mb-4">3. User Accounts</h2>
                <p className="text-muted-foreground leading-relaxed">
                  When you create an account with us, you must provide accurate, complete, and current information. 
                  You are responsible for safeguarding your password and for any activities under your account.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display mb-4">4. Model Profiles</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Models using our platform warrant that all information provided is accurate and that they have 
                  the right to use any images uploaded. GSModeling reserves the right to remove any content that 
                  violates these terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display mb-4">5. Booking & Payments</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All bookings made through the platform are subject to our booking policies. Payment terms, 
                  cancellation policies, and commission structures are outlined in separate booking agreements.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display mb-4">6. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The platform and its original content, features, and functionality are owned by GSModeling 
                  and are protected by international copyright, trademark, and other intellectual property laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display mb-4">7. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  GSModeling shall not be liable for any indirect, incidental, special, consequential, or 
                  punitive damages resulting from your use or inability to use the service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display mb-4">8. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these Terms, please contact us at{' '}
                  <a href="mailto:legal@gsmodeling.com" className="text-accent hover:underline">
                    legal@gsmodeling.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Terms;
