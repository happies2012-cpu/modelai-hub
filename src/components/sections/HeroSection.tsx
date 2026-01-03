import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
  onCtaClick?: () => void;
}

export const HeroSection = ({ 
  title, 
  subtitle, 
  backgroundImage, 
  ctaText, 
  ctaLink,
  onCtaClick 
}: HeroSectionProps) => {
  return (
    <section 
      className="relative h-[60vh] min-h-[500px] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none' }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="container relative z-10 text-center text-white px-6">
        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">{title}</h1>
        {subtitle && (
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">{subtitle}</p>
        )}
        {ctaText && (
          <Button 
            size="lg" 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={onCtaClick || (() => ctaLink && (window.location.href = ctaLink))}
          >
            {ctaText}
          </Button>
        )}
      </div>
    </section>
  );
};