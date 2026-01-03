import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useModel = (id: string | undefined) => {
  return useQuery({
    queryKey: ['model', id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error('Model ID is required');

      const { data, error } = await supabase
        .from('models')
        .select(`
          *,
          portfolio_images(id, image_url, is_cover, title, description, display_order),
          agencies(id, name, logo_url, email, phone, website),
          model_category_mapping(
            category_id,
            model_categories(id, name, description)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Fetch reviews separately
      const { data: reviews } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          reviewer:profiles!reviews_reviewer_id_fkey(full_name, avatar_url)
        `)
        .eq('reviewee_id', id);

      return { ...data, reviews: reviews || [] };

    },
  });
};
