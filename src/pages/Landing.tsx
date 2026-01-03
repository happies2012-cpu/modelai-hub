import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Users, Zap, CheckCircle2, TrendingUp, Globe } from 'lucide-react';
import { useSEO } from '@/lib/seo';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const Landing = () => {
  const navigate = useNavigate();

  useSEO({
    title: 'Premium Digital Platform - Transform Your Journey',
    description: 'Join an exclusive community with AI-powered assistance, premium features, and secure access to paid communities.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Premium Digital Platform',
      url: typeof window !== 'undefined' ? window.location.origin : '',
    },
  });

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'AI-Powered Assistant',
      description: 'Get instant help from our advanced AI chatbot trained on platform content',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Exclusive Communities',
      description: 'Access premium WhatsApp and Telegram groups with verified members',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and privacy-first design',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Premium Features',
      description: 'Unlock advanced tools and priority support',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Active Members' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' },
    { value: '100+', label: 'Countries' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M50 50m-20 0a20 20 0 1 1 40 0a20 20 0 1 1 -40 0'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto space-y-8"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Premium Platform</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
              Transform Your Journey
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                With Premium Access
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join an exclusive community powered by AI, secured by enterprise-grade technology,
              and designed for those who demand the best.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="h-14 px-8 text-lg"
                onClick={() => navigate('/login')}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg"
                onClick={() => navigate('/features')}
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-4"
            >
              <h2 className="text-4xl font-bold">Our Story</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We built this platform for those who refuse to settle for ordinary.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-lg max-w-none space-y-6 text-muted-foreground"
            >
              <p>
                In a world where digital experiences are often compromised by poor design,
                security vulnerabilities, and lack of innovation, we set out to create something different.
              </p>
              <p>
                Our platform combines cutting-edge AI technology with human-centered design,
                ensuring every interaction feels premium, secure, and meaningful.
              </p>
              <p>
                We believe in the power of community, the importance of privacy, and the value
                of providing tools that truly make a difference. That's why we've built a platform
                that doesn't just meet expectations—it exceeds them.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need in one premium platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-lg text-primary-foreground/80">
              Join thousands of members who have transformed their journey with our platform
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="h-14 px-8 text-lg"
              onClick={() => navigate('/login')}
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;

