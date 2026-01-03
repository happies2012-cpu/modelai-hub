import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CTASectionProps {
  title: string;
  description: string;
  primaryCTA?: {
    text: string;
    link: string;
  };
  secondaryCTA?: {
    text: string;
    link: string;
  };
}

export const CTASection = ({ title, description, primaryCTA, secondaryCTA }: CTASectionProps) => {
  return (
    <section className="py-20 bg-primary/5">
      <div className="container px-6 text-center">
        <h2 className="text-4xl font-serif font-bold mb-4">{title}</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{description}</p>
        <div className="flex gap-4 justify-center flex-wrap">
          {primaryCTA && (
            <Button 
              size="lg" 
              onClick={() => window.location.href = primaryCTA.link}
            >
              {primaryCTA.text}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
          {secondaryCTA && (
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => window.location.href = secondaryCTA.link}
            >
              {secondaryCTA.text}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};