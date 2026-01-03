import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCastings = () => {
  return useQuery({
    queryKey: ['castings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          creator:profiles!events_created_by_fkey(full_name, avatar_url)
        `)
        .eq('event_type', 'casting')
        .eq('status', 'active')
        .order('start_date', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};
