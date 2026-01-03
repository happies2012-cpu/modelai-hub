import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useModel } from '@/hooks/useModel';
import { useFavorites } from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import BookingForm from '@/components/forms/BookingForm';
import { Loader2, Star, Heart, User } from 'lucide-react';

const ModelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: model, isLoading, error } = useModel(id);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const toggleFavorite = () => {
    if (!id) return;
    isFavorite(id) ? removeFavorite(id) : addFavorite(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Model Not Found</h2>
          <Link to="/models">
            <Button variant="outline">Back to Models</Button>
          </Link>
        </div>
      </div>
    );
  }

  const portfolioImages = model.portfolio_images || [];
  const avgRating = model.rating || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Portfolio */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 gap-4">
              {portfolioImages.map((image: any, idx: number) => (
                <div key={image.id} className={idx === 0 ? 'col-span-2' : ''}>
                  <div className={`aspect-[${idx === 0 ? '16/9' : '3/4'}] bg-muted rounded-lg overflow-hidden`}>
                    <img
                      src={image.image_url}
                      alt={image.title || model.full_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{model.stage_name || model.full_name}</h1>
                      {model.stage_name && <p className="text-muted-foreground">{model.full_name}</p>}
                    </div>
                    <Button variant="outline" size="icon" onClick={toggleFavorite}>
                      <Heart className={`h-5 w-5 ${isFavorite(id!) ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="font-semibold">{avgRating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({model.total_bookings || 0} bookings)</span>
                  </div>

                  {model.featured && <Badge className="mt-2">Featured Model</Badge>}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Height</span>
                    <span className="font-medium">{model.height_cm}cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gender</span>
                    <span className="font-medium">{model.gender}</span>
                  </div>
                  {model.bust_cm && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Measurements</span>
                      <span className="font-medium">{model.bust_cm}-{model.waist_cm}-{model.hips_cm}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hair</span>
                    <span className="font-medium">{model.hair_color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Eyes</span>
                    <span className="font-medium">{model.eye_color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Experience</span>
                    <span className="font-medium">{model.experience_years} years</span>
                  </div>
                </div>

                {model.agencies && (
                  <div className="mb-6 pb-6 border-b">
                    <h3 className="font-semibold mb-2">Represented By</h3>
                    <Link to={`/agencies/${model.agencies.id}`} className="flex items-center gap-3 hover:opacity-80">
                      {model.agencies.logo_url && (
                        <img src={model.agencies.logo_url} alt={model.agencies.name} className="h-8 w-8 object-cover rounded" />
                      )}
                      <span className="font-medium">{model.agencies.name}</span>
                    </Link>
                  </div>
                )}

                <div className="space-y-3">
                  <BookingForm modelId={model.id} agencyId={model.agency_id} />
                  <Button variant="outline" className="w-full">Request Portfolio</Button>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            {model.model_category_mapping && model.model_category_mapping.length > 0 && (
              <Card className="mt-4">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {model.model_category_mapping.map((mapping: any) => (
                      <Badge key={mapping.category_id} variant="secondary">
                        {mapping.model_categories.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Reviews */}
        {Array.isArray(model.reviews) && model.reviews.length > 0 && (
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Reviews ({model.reviews.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {model.reviews.map((review: any) => (
                  <div key={review.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">Client</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ModelDetail;
