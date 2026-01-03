import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { hasActiveSubscription, getUserSubscription } from '@/lib/payments';
import { 
  Sparkles, Users, CreditCard, MessageSquare, 
  ArrowRight, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { useSEO } from '@/lib/seo';
import { ProtectedRouteWithSubscription } from '@/components/ProtectedRouteWithSubscription';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);

  useSEO({
    title: 'Dashboard - Your Premium Platform',
    description: 'Access your dashboard, manage your subscription, and explore premium features.',
  });

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const active = await hasActiveSubscription(user.id);
        setHasSubscription(active);
        
        if (active) {
          const sub = await getUserSubscription(user.id);
          setSubscription(sub);
        }
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasSubscription) {
    return (
      <ProtectedRouteWithSubscription requireSubscription>
        <div className="min-h-screen flex items-center justify-center p-8">
          <Card className="max-w-md w-full">
            <CardHeader>
              <div className="flex items-center gap-2 text-destructive mb-2">
                <AlertCircle className="w-5 h-5" />
                <CardTitle>Subscription Required</CardTitle>
              </div>
              <CardDescription>
                You need an active subscription to access the dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate('/pricing')}>
                View Plans
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProtectedRouteWithSubscription>
    );
  }

  return (
    <ProtectedRouteWithSubscription requireSubscription>
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
          </motion.div>

          {/* Subscription Status */}
          {subscription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-green-500/20 bg-green-500/5">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <CardTitle>Active Subscription</CardTitle>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate('/subscription')}>
                      Manage
                    </Button>
                  </div>
                  <CardDescription>
                    Your subscription is active until {new Date(subscription.current_period_end).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          )}

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/community')}>
                <CardHeader>
                  <Users className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Communities</CardTitle>
                  <CardDescription>Access exclusive WhatsApp and Telegram groups</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-between">
                    View Communities
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/billing')}>
                <CardHeader>
                  <CreditCard className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Billing</CardTitle>
                  <CardDescription>Manage your subscription and payment methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-between">
                    View Billing
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/contact')}>
                <CardHeader>
                  <MessageSquare className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Support</CardTitle>
                  <CardDescription>Get help from our AI assistant or contact support</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-between">
                    Contact Support
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* AI Chat Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <CardTitle>AI Assistant</CardTitle>
                </div>
                <CardDescription>
                  Need help? Our AI assistant is available 24/7
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Click the chat icon in the bottom right corner to start a conversation.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ProtectedRouteWithSubscription>
  );
};

export default UserDashboard;

