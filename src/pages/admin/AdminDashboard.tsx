import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CreditCard, TrendingUp, MessageSquare } from 'lucide-react';
import { useSEO } from '@/lib/seo';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    pendingSupport: 0,
  });

  useSEO({
    title: 'Admin Dashboard',
    description: 'Admin dashboard for managing the platform.',
  });

  useEffect(() => {
    const loadStats = async () => {
      // Load statistics
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: subCount } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      setStats({
        totalUsers: userCount || 0,
        activeSubscriptions: subCount || 0,
        totalRevenue: 0, // Calculate from payments
        pendingSupport: 0, // Calculate from contact submissions
      });
    };
    loadStats();
  }, []);

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto max-w-7xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform overview and management</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/users')}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Users className="w-8 h-8 text-primary" />
                    <span className="text-2xl font-bold">{stats.totalUsers}</span>
                  </div>
                  <CardTitle>Total Users</CardTitle>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/subscriptions')}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CreditCard className="w-8 h-8 text-primary" />
                    <span className="text-2xl font-bold">{stats.activeSubscriptions}</span>
                  </div>
                  <CardTitle>Active Subscriptions</CardTitle>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <TrendingUp className="w-8 h-8 text-primary" />
                    <span className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</span>
                  </div>
                  <CardTitle>Total Revenue</CardTitle>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/admin/support')}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <MessageSquare className="w-8 h-8 text-primary" />
                    <span className="text-2xl font-bold">{stats.pendingSupport}</span>
                  </div>
                  <CardTitle>Pending Support</CardTitle>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;

