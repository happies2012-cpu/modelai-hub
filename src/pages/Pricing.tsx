import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { useSEO } from '@/lib/seo';

const Pricing = () => {
  const navigate = useNavigate();

  useSEO({
    title: 'Pricing - Choose Your Plan',
    description: 'Select the perfect subscription plan for your needs. Monthly and annual options available.',
  });

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: 999,
      period: 'month',
      description: 'Perfect for trying out our platform',
      features: [
        'Full platform access',
        'AI chatbot support',
        'Community access (WhatsApp & Telegram)',
        'Priority support',
        'Regular feature updates',
        'Mobile app access',
      ],
      popular: false,
    },
    {
      id: 'yearly',
      name: 'Annual Plan',
      price: 9999,
      period: 'year',
      originalPrice: 11988,
      savings: 'Save ₹1,989 (17%)',
      description: 'Best value for long-term users',
      features: [
        'Everything in Monthly',
        '2 months free',
        'Exclusive content access',
        'VIP community access',
        'Priority feature requests',
        'Dedicated support channel',
        'Early access to new features',
      ],
      popular: true,
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
            <h1 className="text-5xl font-bold">Simple, Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground">
              Choose the plan that works best for you
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-lg border-2 ${
                  plan.popular
                    ? 'border-primary bg-primary/5 scale-105'
                    : 'border-border bg-card'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">₹{plan.price.toLocaleString()}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                    {plan.originalPrice && (
                      <div className="mt-2">
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{plan.originalPrice.toLocaleString()}
                        </span>
                        <span className="ml-2 text-sm text-green-600 font-medium">
                          {plan.savings}
                        </span>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full h-12"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => navigate('/login')}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: 'Can I cancel anytime?',
                a: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept credit/debit cards, UPI, Google Pay, and other popular payment methods through our secure payment gateway.',
              },
              {
                q: 'How do I access the communities?',
                a: 'After payment confirmation, you\'ll receive access to exclusive WhatsApp and Telegram group links in your dashboard.',
              },
              {
                q: 'Is there a free trial?',
                a: 'We don\'t offer free trials, but we have a 30-day money-back guarantee if you\'re not satisfied.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-lg border bg-card"
              >
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-muted-foreground text-sm">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;

