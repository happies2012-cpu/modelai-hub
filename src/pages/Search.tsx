import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useModels } from '@/hooks/useModels';
import { Search as SearchIcon, SlidersHorizontal, Loader2, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [gender, setGender] = useState<string>('');
  const [heightRange, setHeightRange] = useState<[number, number]>([140, 200]);
  const [available, setAvailable] = useState<string>('');
  const [featured, setFeatured] = useState<string>('');
  const [sortBy, setSortBy] = useState('newest');

  const { data: models, isLoading } = useModels({
    searchQuery: searchQuery || undefined,
    gender: gender || undefined,
    minHeight: heightRange[0],
    maxHeight: heightRange[1],
    available: available === 'yes' ? true : available === 'no' ? false : undefined,
    featured: featured === 'yes' ? true : featured === 'no' ? false : undefined,
  });

  const clearFilters = () => {
    setSearchQuery('');
    setGender('');
    setHeightRange([140, 200]);
    setAvailable('');
    setFeatured('');
    setSortBy('newest');
  };

  const sortedModels = models ? [...models].sort((a: any, b: any) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'name':
        return a.full_name.localeCompare(b.full_name);
      case 'featured':
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  }) : [];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-12 bg-muted/30">
        <div className="container px-6">
          <h1 className="text-4xl font-serif font-bold mb-4">Search Models</h1>
          <p className="text-muted-foreground">Find the perfect talent for your project</p>
        </div>
      </div>

      <div className="container px-6 py-8">
        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or characteristics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />
              Advanced Filters
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Label className="mb-2 block">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Genders" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Genders</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="non-binary">Non-Binary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">Availability</Label>
                <Select value={available} onValueChange={setAvailable}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    <SelectItem value="yes">Available</SelectItem>
                    <SelectItem value="no">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">Featured</Label>
                <Select value={featured} onValueChange={setFeatured}>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    <SelectItem value="yes">Featured Only</SelectItem>
                    <SelectItem value="no">Non-Featured</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label className="mb-4 block">Height Range: {heightRange[0]}cm - {heightRange[1]}cm</Label>
                <Slider
                  min={140}
                  max={200}
                  step={1}
                  value={heightRange}
                  onValueChange={(val) => setHeightRange(val as [number, number])}
                  className="w-full"
                />
              </div>

              <div>
                <Label className="mb-2 block">Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="featured">Featured First</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear All Filters
            </Button>
          </Card>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : sortedModels.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No models found matching your criteria</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Found {sortedModels.length} models
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {sortedModels.map((model: any) => {
                const coverImage = model.portfolio_images?.find((img: any) => img.is_cover)?.image_url ||
                  model.portfolio_images?.[0]?.image_url;

                return (
                  <Link key={model.id} to={`/models/${model.id}`} className="group">
                    <div className="aspect-[3/4] bg-muted rounded-lg mb-2 overflow-hidden relative">
                      {coverImage && (
                        <img
                          src={coverImage}
                          alt={model.full_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      {model.featured && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current" />
                          Featured
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium">{model.stage_name || model.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {model.height_cm}cm | {model.gender}
                      {model.rating > 0 && (
                        <span className="ml-2">⭐ {model.rating.toFixed(1)}</span>
                      )}
                    </p>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Search;