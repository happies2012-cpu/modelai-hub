import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

export const useAgencyAnalytics = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['agency-analytics', userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      // Get agency profile
      const { data: agency } = await supabase
        .from('agencies')
        .select('id, name')
        .eq('user_id', userId)
        .single();

      if (!agency) {
        return {
          totalRevenue: 0,
          totalModels: 0,
          activeBookings: 0,
          monthlyRevenue: [],
          topPerformingModels: [],
          recentBookings: [],
        };
      }

      // Get models count
      const { count: modelsCount } = await supabase
        .from('models')
        .select('*', { count: 'exact', head: true })
        .eq('agency_id', agency.id);

      // Get all bookings for agency models
      const { data: allBookings } = await supabase
        .from('bookings')
        .select(`
          *,
          model:models!inner(full_name, stage_name, agency_id)
        `)
        .eq('model.agency_id', agency.id);

      const totalRevenue = allBookings
        ?.filter(b => b.status === 'approved')
        .reduce((sum, b) => sum + Number(b.amount), 0) || 0;

      const activeBookings = allBookings?.filter(
        b => b.status === 'pending' || b.status === 'active'
      ).length || 0;

      // Get monthly revenue for last 6 months
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const monthStart = startOfMonth(subMonths(new Date(), i));
        const monthEnd = endOfMonth(subMonths(new Date(), i));

        const { data: monthBookings } = await supabase
          .from('bookings')
          .select(`
            amount,
            model:models!inner(agency_id)
          `)
          .eq('model.agency_id', agency.id)
          .eq('status', 'approved')
          .gte('booking_date', monthStart.toISOString())
          .lte('booking_date', monthEnd.toISOString());

        const monthRevenue = monthBookings?.reduce((sum, b) => sum + Number(b.amount), 0) || 0;
        monthlyData.push({
          month: format(monthStart, 'MMM'),
          revenue: monthRevenue,
        });
      }

      // Get top performing models by total bookings and earnings
      const { data: models } = await supabase
        .from('models')
        .select(`
          id,
          full_name,
          stage_name,
          rating,
          total_bookings
        `)
        .eq('agency_id', agency.id)
        .order('total_bookings', { ascending: false })
        .limit(5);

      const topPerformingModels = await Promise.all(
        (models || []).map(async (model) => {
          const { data: bookings } = await supabase
            .from('bookings')
            .select('amount')
            .eq('model_id', model.id)
            .eq('status', 'approved');

          const earnings = bookings?.reduce((sum, b) => sum + Number(b.amount), 0) || 0;

          return {
            ...model,
            earnings,
          };
        })
      );

      // Get recent bookings
      const { data: recentBookings } = await supabase
        .from('bookings')
        .select(`
          *,
          model:models!inner(full_name, stage_name, agency_id),
          client:profiles!bookings_client_id_fkey(full_name, email)
        `)
        .eq('model.agency_id', agency.id)
        .order('booking_date', { ascending: false })
        .limit(10);

      return {
        totalRevenue,
        totalModels: modelsCount || 0,
        activeBookings,
        monthlyRevenue: monthlyData,
        topPerformingModels: topPerformingModels.sort((a, b) => b.earnings - a.earnings),
        recentBookings: recentBookings || [],
      };
    },
  });
};
