import { useParams, Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAgency } from '@/hooks/useAgency';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, Phone, Globe, MapPin } from 'lucide-react';

const AgencyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: agency, isLoading, error } = useAgency(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !agency) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Agency Not Found</h2>
          <Link to="/agencies">
            <Button variant="outline">Back to Agencies</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {agency.logo_url && (
                <img src={agency.logo_url} alt={agency.name} className="h-20 w-20 object-cover rounded" />
              )}
              <div>
                <h1 className="text-4xl font-bold mb-2">{agency.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{agency.city}, {agency.country}</span>
                </div>
              </div>
            </div>
            {agency.verified && (
              <Badge variant="secondary" className="text-lg px-4 py-2">Verified Agency</Badge>
            )}
          </div>

          <p className="text-lg text-muted-foreground max-w-3xl mb-6">{agency.description}</p>

          <div className="flex flex-wrap gap-4">
            {agency.email && (
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                {agency.email}
              </Button>
            )}
            {agency.phone && (
              <Button variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                {agency.phone}
              </Button>
            )}
            {agency.website && (
              <Button variant="outline" asChild>
                <a href={agency.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-2" />
                  Visit Website
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Model Roster */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Model Roster ({agency.models?.length || 0})</h2>
          
          {agency.models && agency.models.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {agency.models.map((model: any) => {
                const coverImage = model.portfolio_images?.find((img: any) => img.is_cover)?.image_url ||
                                  model.portfolio_images?.[0]?.image_url ||
                                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop';
                
                return (
                  <Link key={model.id} to={`/models/${model.id}`}>
                    <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="aspect-[3/4] bg-muted rounded-t-lg overflow-hidden">
                          <img
                            src={coverImage}
                            alt={model.full_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="font-semibold truncate">{model.stage_name || model.full_name}</h3>
                          <p className="text-sm text-muted-foreground">{model.height_cm}cm</p>
                          {model.featured && (
                            <Badge className="mt-1 text-xs">Featured</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No models currently listed for this agency.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AgencyDetail;
