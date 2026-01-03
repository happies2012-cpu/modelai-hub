import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-main.jpg';

export const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Fashion modeling platform showcase"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
          Discover the Future
          <br />
          <span className="text-gold">of Talent</span>
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto font-light">
          AI-powered platform connecting world-class models, agencies, and brands in one seamless ecosystem
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-white text-black hover:bg-white/90 transition-smooth group"
          >
            Explore Talent
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-smooth" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-black transition-smooth"
          >
            For Agencies
          </Button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};
