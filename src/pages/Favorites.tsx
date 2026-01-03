import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useFavorites } from '@/hooks/useFavorites';
import { Heart, X } from 'lucide-react';

const Favorites = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const { favorites, isLoading, removeFavorite } = useFavorites();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate('/auth');
      } else {
        setUser(user);
      }
    });
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading favorites...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-background pt-20">
        <div className="container-luxury py-8">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-display">My Favorites</h1>
          </div>

          {!favorites || favorites.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <h2 className="text-xl font-display mb-2">No favorites yet</h2>
              <p className="text-muted-foreground mb-6">
                Start exploring models and save your favorites here
              </p>
              <Link to="/models">
                <Button>Browse Models</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {favorites.map((fav: any) => {
                const model = fav.models;
                const coverImage = model?.portfolio_images?.find((img: any) => img.is_cover)?.image_url 
                  || model?.portfolio_images?.[0]?.image_url
                  || '/placeholder.svg';

                return (
                  <div key={fav.id} className="group relative">
                    <Link to={`/models/${model?.id}`}>
                      <div className="model-card">
                        <div className="aspect-model overflow-hidden">
                          <img
                            src={coverImage}
                            alt={model?.full_name || 'Model'}
                            className="model-card-image"
                          />
                        </div>
                        <div className="model-card-overlay" />
                        <div className="model-card-content">
                          <h3 className="font-display text-lg">
                            {model?.stage_name || model?.full_name}
                          </h3>
                          {model?.height_cm && (
                            <p className="text-sm text-white/70">{model.height_cm} cm</p>
                          )}
                        </div>
                      </div>
                    </Link>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFavorite(model?.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Favorites;
