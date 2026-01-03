import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, Users, Globe, Lock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSEO } from '@/lib/seo';

const Features = () => {
  const navigate = useNavigate();

  useSEO({
    title: 'Features - Premium Platform',
    description: 'Discover all the premium features including AI chatbot, secure communities, enterprise security, and more.',
  });

  const mainFeatures = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'AI-Powered Assistant',
      description: 'Get instant help from our advanced AI chatbot trained on platform content. Available 24/7 to answer your questions.',
      details: [
        'Natural language processing',
        'Context-aware responses',
        'Multi-language support',
        'Learning from interactions',
      ],
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Exclusive Communities',
      description: 'Access premium WhatsApp and Telegram groups with verified members. Connect with like-minded individuals.',
      details: [
        'WhatsApp premium groups',
        'Telegram exclusive channels',
        'Verified members only',
        'Moderated discussions',
      ],
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and privacy-first design. Your data is protected with industry-leading security measures.',
      details: [
        'End-to-end encryption',
        'Two-factor authentication',
        'Regular security audits',
        'GDPR compliant',
      ],
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Privacy Controls',
      description: 'Complete control over your data. Disable right-click, text selection, and screenshot attempts for maximum privacy.',
      details: [
        'Content protection',
        'Privacy settings',
        'Data export',
        'Account deletion',
      ],
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Global Access',
      description: 'Access your account from anywhere in the world. Cloud-neutral design ensures reliability.',
      details: [
        'Multi-region support',
        '99.9% uptime SLA',
        'Fast CDN delivery',
        'Mobile optimized',
      ],
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Premium Experience',
      description: 'Beautiful, human-designed interface with micro-interactions and smooth animations throughout.',
      details: [
        'Premium UI/UX',
        'Dark mode support',
        'Responsive design',
        'Accessibility features',
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <h1 className="text-5xl font-bold">Premium Features</h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to succeed, all in one platform
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-lg border bg-card hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <h2 className="text-4xl font-bold">Ready to Experience These Features?</h2>
            <p className="text-lg text-primary-foreground/80">
              Join thousands of members enjoying premium access
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="h-14 px-8 text-lg"
              onClick={() => navigate('/pricing')}
            >
              View Pricing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;

