import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight, Play, Star, Users, Camera, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const heroSlides = [
  {
    id: 1,
    title: "Discover the Future",
    subtitle: "of Talent",
    description: "AI-powered platform connecting world-class models, agencies, and brands in one seamless ecosystem",
    cta: "Explore Talent",
    ctaLink: "/models",
    secondaryCta: "For Agencies",
    secondaryLink: "/agencies/become-partner",
    gradient: "from-black/70 via-black/50 to-transparent",
    accent: "gold"
  },
  {
    id: 2,
    title: "Elite Fashion",
    subtitle: "Models",
    description: "Connect with top-tier runway and editorial models from around the globe",
    cta: "Browse Models",
    ctaLink: "/models/fashion",
    secondaryCta: "Post Casting",
    secondaryLink: "/create-casting",
    gradient: "from-purple-900/70 via-black/50 to-transparent",
    accent: "purple"
  },
  {
    id: 3,
    title: "Commercial",
    subtitle: "Success",
    description: "Find the perfect face for your brand campaigns and advertising projects",
    cta: "Start Campaign",
    ctaLink: "/create-campaign",
    secondaryCta: "View Campaigns",
    secondaryLink: "/campaigns",
    gradient: "from-blue-900/70 via-black/50 to-transparent",
    accent: "blue"
  },
  {
    id: 4,
    title: "Runway Ready",
    subtitle: "Professionals",
    description: "Book experienced runway models for fashion weeks and designer showcases",
    cta: "Find Runway Models",
    ctaLink: "/models/runway",
    secondaryCta: "Create Event",
    secondaryLink: "/create-event",
    gradient: "from-rose-900/70 via-black/50 to-transparent",
    accent: "rose"
  },
  {
    id: 5,
    title: "New Faces",
    subtitle: "Rising Stars",
    description: "Discover emerging talent and be the first to book tomorrow's supermodels",
    cta: "Discover New Faces",
    ctaLink: "/models/new-faces",
    secondaryCta: "Join as Model",
    secondaryLink: "/create-model",
    gradient: "from-emerald-900/70 via-black/50 to-transparent",
    accent: "emerald"
  },
  {
    id: 6,
    title: "Agency",
    subtitle: "Network",
    description: "Partner with leading modeling agencies worldwide for exclusive talent access",
    cta: "View Agencies",
    ctaLink: "/agencies",
    secondaryCta: "Become Partner",
    secondaryLink: "/agencies/become-partner",
    gradient: "from-amber-900/70 via-black/50 to-transparent",
    accent: "amber"
  },
  {
    id: 7,
    title: "Plus Size",
    subtitle: "Excellence",
    description: "Celebrate diversity with our curated selection of plus-size models",
    cta: "Explore Plus Size",
    ctaLink: "/models/plus-size",
    secondaryCta: "Learn More",
    secondaryLink: "/services",
    gradient: "from-pink-900/70 via-black/50 to-transparent",
    accent: "pink"
  },
  {
    id: 8,
    title: "AI-Powered",
    subtitle: "Matching",
    description: "Let our intelligent algorithms find the perfect talent for your specific needs",
    cta: "Try AI Search",
    ctaLink: "/search",
    secondaryCta: "How It Works",
    secondaryLink: "/company/about",
    gradient: "from-cyan-900/70 via-black/50 to-transparent",
    accent: "cyan"
  }
];

const backgroundImages = [
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1920&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1920&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1920&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1920&q=80",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1920&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1920&q=80"
];

const stats = [
  { icon: Users, value: "10K+", label: "Models" },
  { icon: Camera, value: "500+", label: "Agencies" },
  { icon: Star, value: "50K+", label: "Bookings" },
  { icon: Sparkles, value: "99%", label: "Satisfaction" }
];

export const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const navigate = useNavigate();

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const slide = heroSlides[currentSlide];

  return (
    <section 
      className="relative h-screen flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          <img
            src={backgroundImages[currentSlide]}
            alt={`${slide.title} ${slide.subtitle}`}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold/30 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: window.innerHeight + 10 
            }}
            animate={{ 
              y: -10,
              x: Math.random() * window.innerWidth
            }}
            transition={{ 
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6"
              >
                <Play className="w-4 h-4 text-gold" />
                <span className="text-sm text-white/90">Slide {currentSlide + 1} of {heroSlides.length}</span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-2 tracking-tight"
              >
                {slide.title}
              </motion.h1>
              
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-gold mb-6 tracking-tight"
              >
                {slide.subtitle}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl font-light leading-relaxed"
              >
                {slide.description}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-white/90 transition-all duration-300 group px-8 py-6 text-lg"
                  onClick={() => navigate(slide.ctaLink)}
                >
                  {slide.cta}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 px-8 py-6 text-lg"
                  onClick={() => navigate(slide.secondaryLink)}
                >
                  {slide.secondaryCta}
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-32 left-0 right-0 mx-auto max-w-4xl"
        >
          <div className="flex items-center justify-between gap-8 px-8 py-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="p-2 bg-gold/20 rounded-lg">
                  <stat.icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/60">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'w-8 bg-gold' 
                : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 right-8 z-10"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-white/50 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};
