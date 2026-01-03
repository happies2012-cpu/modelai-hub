import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const Privacy = () => {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-background">
        <section className="section-padding">
          <div className="container-luxury max-w-4xl">
            <h1 className="text-3xl md:text-4xl mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground mb-12">Last updated: December 2024</p>

            <div className="space-y-8">
              <section>
                <h2 className="text-xl font-display mb-4">Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We collect information you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Account information (name, email, phone number)</li>
                  <li>Profile information (measurements, photos, portfolio)</li>
                  <li>Payment information for transactions</li>
                  <li>Communications you send to us</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-display mb-4">How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Connect models with agencies and brands</li>
                  <li>Send promotional communications (with your consent)</li>
                  <li>Respond to your comments and questions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-display mb-4">Information Sharing</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not sell your personal information. We may share your information with third parties 
                  only in the following circumstances: with your consent, to comply with laws, to protect 
                  rights and safety, and with service providers who assist in our operations.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display mb-4">Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal 
                  information against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display mb-4">Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to processing of your data</li>
                  <li>Data portability</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-display mb-4">Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar tracking technologies to track activity on our platform and 
                  hold certain information. You can instruct your browser to refuse all cookies or to 
                  indicate when a cookie is being sent.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-display mb-4">Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions about this Privacy Policy, please contact us at{' '}
                  <a href="mailto:privacy@gsmodeling.com" className="text-accent hover:underline">
                    privacy@gsmodeling.com
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

export default Privacy;
