import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

export const useModelAnalytics = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['model-analytics', userId],
    enabled: !!userId,
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      // Get model profile
      const { data: model } = await supabase
        .from('models')
        .select('id, rating, total_bookings')
        .eq('user_id', userId)
        .single();

      if (!model) {
        return {
          totalEarnings: 0,
          totalBookings: 0,
          averageRating: 0,
          portfolioCount: 0,
          monthlyEarnings: [],
          bookingsByStatus: [],
          recentBookings: [],
        };
      }

      // Get portfolio count
      const { count: portfolioCount } = await supabase
        .from('portfolio_images')
        .select('*', { count: 'exact', head: true })
        .eq('model_id', model.id);

      // Get total earnings from completed bookings
      const { data: completedBookings } = await supabase
        .from('bookings')
        .select('amount, booking_date, status, client_id')
        .eq('model_id', model.id)
        .eq('status', 'approved');

      const totalEarnings = completedBookings?.reduce((sum, b) => sum + Number(b.amount), 0) || 0;

      // Get monthly earnings for last 6 months
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const monthStart = startOfMonth(subMonths(new Date(), i));
        const monthEnd = endOfMonth(subMonths(new Date(), i));

        const { data: monthBookings } = await supabase
          .from('bookings')
          .select('amount')
          .eq('model_id', model.id)
          .eq('status', 'approved')
          .gte('booking_date', monthStart.toISOString())
          .lte('booking_date', monthEnd.toISOString());

        const monthEarnings = monthBookings?.reduce((sum, b) => sum + Number(b.amount), 0) || 0;
        monthlyData.push({
          month: format(monthStart, 'MMM'),
          earnings: monthEarnings,
        });
      }

      // Get bookings by status
      const { data: allBookings } = await supabase
        .from('bookings')
        .select('status')
        .eq('model_id', model.id);

      const statusCounts = allBookings?.reduce((acc: any, booking) => {
        acc[booking.status] = (acc[booking.status] || 0) + 1;
        return acc;
      }, {});

      const bookingsByStatus = Object.entries(statusCounts || {}).map(([status, count]) => ({
        status,
        count,
      }));

      // Get recent bookings with client info
      const { data: recentBookings } = await supabase
        .from('bookings')
        .select(`
          *,
          client:profiles!bookings_client_id_fkey(full_name, email)
        `)
        .eq('model_id', model.id)
        .order('booking_date', { ascending: false })
        .limit(5);

      return {
        totalEarnings,
        totalBookings: model.total_bookings || 0,
        averageRating: model.rating || 0,
        portfolioCount: portfolioCount || 0,
        monthlyEarnings: monthlyData,
        bookingsByStatus,
        recentBookings: recentBookings || [],
      };
    },
  });
};
