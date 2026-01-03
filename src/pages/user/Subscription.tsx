import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserSubscription, hasActiveSubscription } from '@/lib/payments';
import { CheckCircle2, AlertCircle, Calendar, CreditCard, ArrowRight } from 'lucide-react';
import { useSEO } from '@/lib/seo';
import { ProtectedRouteWithSubscription } from '@/components/ProtectedRouteWithSubscription';

const Subscription = () => {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'Subscription - Manage Your Plan',
    description: 'View and manage your subscription plan, billing cycle, and renewal settings.',
  });

  useEffect(() => {
    const loadSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const sub = await getUserSubscription(user.id);
        setSubscription(sub);
      }
      setLoading(false);
    };
    loadSubscription();
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

  return (
    <ProtectedRouteWithSubscription>
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto max-w-4xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-4xl font-bold">Subscription</h1>
            <p className="text-muted-foreground">Manage your subscription and billing</p>
          </motion.div>

          {subscription ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <CardTitle>Active Subscription</CardTitle>
                    </div>
                    <Button variant="outline" onClick={() => navigate('/billing')}>
                      Manage Billing
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Current Period</span>
                      </div>
                      <p className="font-medium">
                        {new Date(subscription.current_period_start).toLocaleDateString()} -{' '}
                        {new Date(subscription.current_period_end).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-sm">Status</span>
                      </div>
                      <p className="font-medium capitalize">{subscription.status}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <AlertCircle className="w-5 h-5" />
                    <CardTitle>No Active Subscription</CardTitle>
                  </div>
                  <CardDescription>
                    Subscribe to unlock all premium features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => navigate('/pricing')}>
                    View Plans
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRouteWithSubscription>
  );
};

export default Subscription;

