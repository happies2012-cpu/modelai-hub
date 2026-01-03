import { Sparkles, Users, Calendar, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Discovery',
    description: 'Smart recommendations match you with perfect talent based on visual attributes and campaign needs',
  },
  {
    icon: Users,
    title: 'Verified Profiles',
    description: 'All models and agencies are verified with comprehensive portfolios and performance analytics',
  },
  {
    icon: Calendar,
    title: 'Direct Booking',
    description: 'Streamlined booking workflow from inquiry to confirmation with secure payment processing',
  },
  {
    icon: TrendingUp,
    title: 'Analytics Dashboard',
    description: 'Track performance, engagement, and ROI with comprehensive insights and reporting',
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose <span className="text-gold">GSMODELING</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The most advanced platform for talent discovery and management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-8 border-0 bg-card hover:shadow-xl transition-elegant group"
              >
                <div className="mb-4 inline-block p-3 bg-gold/10 rounded-lg group-hover:bg-gold/20 transition-smooth">
                  <Icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
