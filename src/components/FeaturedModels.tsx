import { Card } from '@/components/ui/card';
import { MapPin, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useModels } from '@/hooks/useModels';
import { useNavigate } from 'react-router-dom';

export const FeaturedModels = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useModels({ featured: true });

  const models = (data || []).slice(0, 4).map((m: any) => {
    const cover =
      m.portfolio_images?.find((p: any) => p.is_cover)?.image_url ||
      m.portfolio_images?.[0]?.image_url ||
      null;

    const category = m.model_category_mapping?.[0]?.model_categories?.name || 'Model';
    const location =
      [m.agencies?.city, m.agencies?.country].filter(Boolean).join(', ') ||
      m.agencies?.country ||
      'Worldwide';

    return {
      id: m.id,
      name: m.full_name,
      location,
      category,
      rating: typeof m.rating === 'number' ? m.rating : Number(m.rating || 0),
      image: cover,
    };
  });

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
          {isLoading &&
            Array.from({ length: 4 }).map((_, idx) => (
              <Card key={idx} className="overflow-hidden border-0 bg-transparent">
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  <Skeleton className="h-full w-full" />
                </div>
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </Card>
            ))}

          {!isLoading &&
            models.map((model) => (
              <Card
                key={model.id}
                onClick={() => navigate(`/models/${model.id}`)}
                className="group cursor-pointer overflow-hidden border-0 bg-transparent transition-elegant hover:-translate-y-2"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  {model.image ? (
                    <img
                      src={model.image}
                      alt={`${model.name} - ${model.category} model portfolio`}
                      className="w-full h-full object-cover transition-elegant group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}
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
                      <span className="text-sm font-medium">{model.rating?.toFixed?.(1) ?? '—'}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>

        {!isLoading && error && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Live data not available yet (configure Supabase + run seed). Showing section layout only.
          </div>
        )}

        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/models')}
            className="inline-flex items-center text-sm font-medium hover:text-gold transition-smooth"
          >
            View All Talent <span className="ml-2">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};
