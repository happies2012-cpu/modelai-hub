import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ChevronDown, 
  MapPin,
  Ruler,
  User,
  Star,
  Calendar,
  DollarSign,
  Palette
} from 'lucide-react';

interface SearchFilters {
  query: string;
  heightMin: number;
  heightMax: number;
  bustMin?: number;
  bustMax?: number;
  waistMin?: number;
  waistMax?: number;
  hipsMin?: number;
  hipsMax?: number;
  ageMin: number;
  ageMax: number;
  gender: string;
  hairColor: string;
  eyeColor: string;
  ethnicity: string;
  country: string;
  city: string;
  category: string;
  ratingMin: number;
  available: boolean;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
}

const defaultFilters: SearchFilters = {
  query: '',
  heightMin: 150,
  heightMax: 200,
  ageMin: 16,
  ageMax: 60,
  gender: '',
  hairColor: '',
  eyeColor: '',
  ethnicity: '',
  country: '',
  city: '',
  category: '',
  ratingMin: 0,
  available: false,
};

const hairColors = ['Black', 'Brown', 'Blonde', 'Red', 'Auburn', 'Gray', 'White', 'Other'];
const eyeColors = ['Brown', 'Blue', 'Green', 'Hazel', 'Gray', 'Amber', 'Other'];
const ethnicities = ['Caucasian', 'African', 'Asian', 'Hispanic', 'Middle Eastern', 'South Asian', 'Mixed', 'Other'];
const genders = ['Female', 'Male', 'Non-Binary'];
const categories = ['Fashion', 'Commercial', 'Editorial', 'Runway', 'Plus Size', 'Fitness', 'Glamour', 'Parts'];

export const AdvancedSearch = ({ onSearch, initialFilters }: AdvancedSearchProps) => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>({ ...defaultFilters, ...initialFilters });
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useEffect(() => {
    // Count active filters
    let count = 0;
    if (filters.query) count++;
    if (filters.heightMin !== 150 || filters.heightMax !== 200) count++;
    if (filters.ageMin !== 16 || filters.ageMax !== 60) count++;
    if (filters.gender) count++;
    if (filters.hairColor) count++;
    if (filters.eyeColor) count++;
    if (filters.ethnicity) count++;
    if (filters.country || filters.city) count++;
    if (filters.category) count++;
    if (filters.ratingMin > 0) count++;
    if (filters.available) count++;
    setActiveFiltersCount(count);
  }, [filters]);

  const handleFilterChange = useCallback((key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSearch = useCallback(() => {
    onSearch(filters);
  }, [filters, onSearch]);

  const handleReset = useCallback(() => {
    setFilters(defaultFilters);
    onSearch(defaultFilters);
  }, [onSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Main Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search models by name, location, or specialization..."
            className="pl-12 h-14 text-lg border-2 focus:border-primary transition-colors"
          />
          {filters.query && (
            <button
              onClick={() => handleFilterChange('query', '')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <Button onClick={handleSearch} size="lg" className="h-14 px-8">
          <Search className="h-5 w-5 mr-2" />
          Search
        </Button>
        
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`h-14 ${isExpanded ? 'bg-primary/10 border-primary' : ''}`}
        >
          <SlidersHorizontal className="h-5 w-5 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge className="ml-2" variant="secondary">{activeFiltersCount}</Badge>
          )}
        </Button>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Physical Measurements */}
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left font-semibold mb-4">
                    <span className="flex items-center gap-2">
                      <Ruler className="h-4 w-4" />
                      Measurements
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4">
                    <div>
                      <Label className="text-sm">Height (cm): {filters.heightMin} - {filters.heightMax}</Label>
                      <Slider
                        min={140}
                        max={220}
                        step={1}
                        value={[filters.heightMin, filters.heightMax]}
                        onValueChange={([min, max]) => {
                          handleFilterChange('heightMin', min);
                          handleFilterChange('heightMax', max);
                        }}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Age: {filters.ageMin} - {filters.ageMax}</Label>
                      <Slider
                        min={14}
                        max={70}
                        step={1}
                        value={[filters.ageMin, filters.ageMax]}
                        onValueChange={([min, max]) => {
                          handleFilterChange('ageMin', min);
                          handleFilterChange('ageMax', max);
                        }}
                        className="mt-2"
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Appearance */}
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left font-semibold mb-4">
                    <span className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Appearance
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-3">
                    <div>
                      <Label className="text-sm mb-1 block">Gender</Label>
                      <Select value={filters.gender} onValueChange={(v) => handleFilterChange('gender', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any</SelectItem>
                          {genders.map(g => (
                            <SelectItem key={g} value={g.toLowerCase()}>{g}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm mb-1 block">Hair Color</Label>
                      <Select value={filters.hairColor} onValueChange={(v) => handleFilterChange('hairColor', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any</SelectItem>
                          {hairColors.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm mb-1 block">Eye Color</Label>
                      <Select value={filters.eyeColor} onValueChange={(v) => handleFilterChange('eyeColor', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any</SelectItem>
                          {eyeColors.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm mb-1 block">Ethnicity</Label>
                      <Select value={filters.ethnicity} onValueChange={(v) => handleFilterChange('ethnicity', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any</SelectItem>
                          {ethnicities.map(e => (
                            <SelectItem key={e} value={e}>{e}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Location */}
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left font-semibold mb-4">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-3">
                    <div>
                      <Label className="text-sm mb-1 block">Country</Label>
                      <Input
                        value={filters.country}
                        onChange={(e) => handleFilterChange('country', e.target.value)}
                        placeholder="e.g., United States"
                      />
                    </div>
                    <div>
                      <Label className="text-sm mb-1 block">City</Label>
                      <Input
                        value={filters.city}
                        onChange={(e) => handleFilterChange('city', e.target.value)}
                        placeholder="e.g., New York"
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Category & Rating */}
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left font-semibold mb-4">
                    <span className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Category & Rating
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-3">
                    <div>
                      <Label className="text-sm mb-1 block">Category</Label>
                      <Select value={filters.category} onValueChange={(v) => handleFilterChange('category', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any</SelectItem>
                          {categories.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm">Minimum Rating: {filters.ratingMin}+</Label>
                      <Slider
                        min={0}
                        max={5}
                        step={0.5}
                        value={[filters.ratingMin]}
                        onValueChange={([v]) => handleFilterChange('ratingMin', v)}
                        className="mt-2"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="available"
                        checked={filters.available}
                        onChange={(e) => handleFilterChange('available', e.target.checked)}
                        className="rounded border-border"
                      />
                      <Label htmlFor="available" className="text-sm cursor-pointer">
                        Available now only
                      </Label>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* Filter Actions */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <Button variant="ghost" onClick={handleReset}>
                  Clear All Filters
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setIsExpanded(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSearch}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Tags */}
      {activeFiltersCount > 0 && !isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap gap-2"
        >
          {filters.gender && (
            <Badge variant="secondary" className="gap-1">
              {filters.gender}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('gender', '')} />
            </Badge>
          )}
          {filters.hairColor && (
            <Badge variant="secondary" className="gap-1">
              Hair: {filters.hairColor}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('hairColor', '')} />
            </Badge>
          )}
          {filters.eyeColor && (
            <Badge variant="secondary" className="gap-1">
              Eyes: {filters.eyeColor}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('eyeColor', '')} />
            </Badge>
          )}
          {filters.category && (
            <Badge variant="secondary" className="gap-1">
              {filters.category}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('category', '')} />
            </Badge>
          )}
          {(filters.heightMin !== 150 || filters.heightMax !== 200) && (
            <Badge variant="secondary" className="gap-1">
              Height: {filters.heightMin}-{filters.heightMax}cm
              <X className="h-3 w-3 cursor-pointer" onClick={() => {
                handleFilterChange('heightMin', 150);
                handleFilterChange('heightMax', 200);
              }} />
            </Badge>
          )}
          {filters.country && (
            <Badge variant="secondary" className="gap-1">
              {filters.country}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('country', '')} />
            </Badge>
          )}
          {filters.ratingMin > 0 && (
            <Badge variant="secondary" className="gap-1">
              Rating: {filters.ratingMin}+
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('ratingMin', 0)} />
            </Badge>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};
