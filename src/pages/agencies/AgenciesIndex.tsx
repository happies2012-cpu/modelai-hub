import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAgencies, AgencyFilters } from '@/hooks/useAgencies';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const AgenciesIndex = () => {
  const [filters, setFilters] = useState<AgencyFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const { data: agencies, isLoading, error } = useAgencies(filters);

  const handleSearch = () => {
    setFilters({ ...filters, searchQuery });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">Error loading agencies</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Modeling Agencies</h1>
          <p className="text-muted-foreground mb-8">Connect with top agencies worldwide</p>
          
          {/* Search */}
          <div className="flex gap-2 max-w-2xl">
            <Input
              placeholder="Search agencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Agencies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agencies?.map((agency: any) => (
            <Link key={agency.id} to={`/agencies/${agency.id}`}>
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    {agency.logo_url && (
                      <img src={agency.logo_url} alt={agency.name} className="h-12 w-12 object-cover rounded" />
                    )}
                    {agency.verified && (
                      <Badge variant="secondary">Verified</Badge>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-xl mb-2">{agency.name}</h3>
                  
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{agency.city}, {agency.country}</span>
                  </div>
                  
                  <p className="text-muted-foreground line-clamp-2 mb-4">
                    {agency.description}
                  </p>

                  <div className="text-sm text-muted-foreground">
                    {agency.models?.length || 0} models
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {agencies?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No agencies found. Try adjusting your search.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AgenciesIndex;
