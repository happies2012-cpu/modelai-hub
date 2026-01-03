import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Loader2, Users, Building2, Calendar, CreditCard, TrendingUp, TrendingDown, Eye, Star } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Stats {
  totalModels: number;
  totalAgencies: number;
  totalEvents: number;
  totalBookings: number;
  totalRevenue: number;
  totalViews: number;
  avgRating: number;
  pendingApprovals: number;
}

export const AnalyticsOverview = () => {
  const [stats, setStats] = useState<Stats>({
    totalModels: 0,
    totalAgencies: 0,
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalViews: 0,
    avgRating: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [bookingsData, setBookingsData] = useState<any[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [
        modelsRes,
        agenciesRes,
        eventsRes,
        bookingsRes,
        paymentsRes,
        viewsRes,
        reviewsRes,
        pendingModelsRes,
        pendingAgenciesRes,
        pendingCampaignsRes,
      ] = await Promise.all([
        supabase.from('models').select('id, created_at', { count: 'exact' }),
        supabase.from('agencies').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('id, created_at', { count: 'exact' }),
        supabase.from('payments').select('amount, created_at').eq('status', 'completed'),
        supabase.from('analytics_views').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('rating'),
        supabase.from('models').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('agencies').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('campaigns').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);

      const totalRevenue = paymentsRes.data?.reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0;
      const avgRating = reviewsRes.data?.length
        ? reviewsRes.data.reduce((sum, r) => sum + r.rating, 0) / reviewsRes.data.length
        : 0;
      const pendingApprovals = (pendingModelsRes.count || 0) + (pendingAgenciesRes.count || 0) + (pendingCampaignsRes.count || 0);

      setStats({
        totalModels: modelsRes.count || 0,
        totalAgencies: agenciesRes.count || 0,
        totalEvents: eventsRes.count || 0,
        totalBookings: bookingsRes.count || 0,
        totalRevenue,
        totalViews: viewsRes.count || 0,
        avgRating: Math.round(avgRating * 10) / 10,
        pendingApprovals,
      });

      // Generate chart data from actual data
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toISOString().split('T')[0];
      });

      const revenueByDay = last30Days.map((date) => {
        const dayRevenue = paymentsRes.data
          ?.filter((p) => p.created_at?.startsWith(date))
          .reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0;
        return { date: date.slice(5), revenue: dayRevenue };
      });

      const bookingsByDay = last30Days.map((date) => {
        const count = bookingsRes.data?.filter((b) => b.created_at?.startsWith(date)).length || 0;
        return { date: date.slice(5), bookings: count };
      });

      setRevenueData(revenueByDay);
      setBookingsData(bookingsByDay);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Models', value: stats.totalModels, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Agencies', value: stats.totalAgencies, icon: Building2, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Events', value: stats.totalEvents, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: CreditCard, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { label: 'Avg Rating', value: stats.avgRating.toFixed(1), icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Pending', value: stats.pendingApprovals, icon: TrendingDown, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Revenue (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Bookings (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="bookings" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};
