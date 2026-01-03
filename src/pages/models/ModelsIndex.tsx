import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useModels, ModelFilters } from '@/hooks/useModels';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const ModelsIndex = () => {
  const [filters, setFilters] = useState<ModelFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const { data: models, isLoading, error } = useModels(filters);

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
    return <div className="min-h-screen flex items-center justify-center">Error loading models</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Discover Models</h1>
          <p className="text-muted-foreground mb-8">Browse our roster of professional models</p>
          
          {/* Search & Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="md:col-span-2 flex gap-2">
              <Input
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            <Select onValueChange={(value) => setFilters({ ...filters, gender: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Non-binary">Non-binary</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setFilters({ ...filters, featured: value === 'true' })}>
              <SelectTrigger>
                <SelectValue placeholder="All Models" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">All Models</SelectItem>
                <SelectItem value="true">Featured Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {models?.map((model: any) => {
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
                      {model.agencies && (
                        <p className="text-xs text-muted-foreground truncate">{model.agencies.name}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {models?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No models found. Try adjusting your filters.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ModelsIndex;
