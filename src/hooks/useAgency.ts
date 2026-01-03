import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAgency = (id: string | undefined) => {
  return useQuery({
    queryKey: ['agency', id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error('Agency ID is required');

      const { data, error } = await supabase
        .from('agencies')
        .select(`
          *,
          models(
            id,
            full_name,
            stage_name,
            gender,
            height_cm,
            featured,
            available,
            rating,
            portfolio_images(image_url, is_cover)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });
};
