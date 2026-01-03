import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AgencyFilters {
  country?: string;
  city?: string;
  verified?: boolean;
  searchQuery?: string;
}

export const useAgencies = (filters?: AgencyFilters) => {
  return useQuery({
    queryKey: ['agencies', filters],
    queryFn: async () => {
      let query = supabase
        .from('agencies')
        .select(`
          *,
          models(id, full_name, stage_name, portfolio_images(image_url, is_cover))
        `)
        .eq('status', 'approved');

      if (filters?.country) {
        query = query.eq('country', filters.country);
      }

      if (filters?.city) {
        query = query.eq('city', filters.city);
      }

      if (filters?.verified !== undefined) {
        query = query.eq('verified', filters.verified);
      }

      if (filters?.searchQuery) {
        query = query.ilike('name', `%${filters.searchQuery}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
