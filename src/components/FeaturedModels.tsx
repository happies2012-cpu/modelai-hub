import { Card } from '@/components/ui/card';
import { MapPin, Star } from 'lucide-react';
import model1 from '@/assets/model-1.jpg';
import model2 from '@/assets/model-2.jpg';
import model3 from '@/assets/model-3.jpg';
import model4 from '@/assets/model-4.jpg';

const models = [
  {
    id: 1,
    name: 'Aria Chen',
    location: 'Mumbai, India',
    category: 'Editorial',
    rating: 4.9,
    image: model1,
  },
  {
    id: 2,
    name: 'Sofia Laurent',
    location: 'Paris, France',
    category: 'Runway',
    rating: 5.0,
    image: model2,
  },
  {
    id: 3,
    name: 'Maya Sharma',
    location: 'Delhi, India',
    category: 'Commercial',
    rating: 4.8,
    image: model3,
  },
  {
    id: 4,
    name: 'Elena Rossi',
    location: 'Milan, Italy',
    category: 'Beauty',
    rating: 4.9,
    image: model4,
  },
];

export const FeaturedModels = () => {
  return (
    <section className="py-24 bg-background" id="discover">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Talent</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover exceptional talent from around the world, verified and ready to bring your vision to life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {models.map((model) => (
            <Card
              key={model.id}
              className="group cursor-pointer overflow-hidden border-0 bg-transparent transition-elegant hover:-translate-y-2"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <img
                  src={model.image}
                  alt={`${model.name} - ${model.category} model portfolio`}
                  className="w-full h-full object-cover transition-elegant group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-elegant" />
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-elegant">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{model.location}</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.category}</p>
                  </div>
                  <div className="flex items-center space-x-1 text-gold">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">{model.rating}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-flex items-center text-sm font-medium hover:text-gold transition-smooth"
          >
            View All Talent
            <span className="ml-2">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};
