import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ModelFilters {
  category?: string;
  gender?: string;
  minHeight?: number;
  maxHeight?: number;
  country?: string;
  city?: string;
  available?: boolean;
  featured?: boolean;
  searchQuery?: string;
}

export const useModels = (filters?: ModelFilters) => {
  return useQuery({
    queryKey: ['models', filters],
    queryFn: async () => {
      let query = supabase
        .from('models')
        .select(`
          *,
          portfolio_images(id, image_url, is_cover, title),
          agencies(id, name, logo_url),
          model_category_mapping(
            category_id,
            model_categories(name)
          )
        `)
        .eq('status', 'approved');

      if (filters?.gender) {
        query = query.eq('gender', filters.gender);
      }

      if (filters?.minHeight) {
        query = query.gte('height_cm', filters.minHeight);
      }

      if (filters?.maxHeight) {
        query = query.lte('height_cm', filters.maxHeight);
      }

      if (filters?.country) {
        query = query.eq('agencies.country', filters.country);
      }

      if (filters?.available !== undefined) {
        query = query.eq('available', filters.available);
      }

      if (filters?.featured !== undefined) {
        query = query.eq('featured', filters.featured);
      }

      if (filters?.searchQuery) {
        query = query.or(`full_name.ilike.%${filters.searchQuery}%,stage_name.ilike.%${filters.searchQuery}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
