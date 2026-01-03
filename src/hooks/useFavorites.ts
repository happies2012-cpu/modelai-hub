import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useFavorites = () => {
  const queryClient = useQueryClient();

  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          model_id,
          created_at,
          models(
            id,
            full_name,
            stage_name,
            height_cm,
            gender,
            portfolio_images(image_url, is_cover)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addFavorite = useMutation({
    mutationFn: async (modelId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in');

      const { error } = await supabase.from('favorites').insert({
        user_id: user.id,
        model_id: modelId,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success('Added to favorites');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add favorite');
    },
  });

  const removeFavorite = useMutation({
    mutationFn: async (modelId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in');

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('model_id', modelId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      toast.success('Removed from favorites');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove favorite');
    },
  });

  const isFavorite = (modelId: string) => {
    return favorites?.some((fav: any) => fav.model_id === modelId) || false;
  };

  return {
    favorites,
    isLoading,
    addFavorite: addFavorite.mutate,
    removeFavorite: removeFavorite.mutate,
    isFavorite,
  };
};
