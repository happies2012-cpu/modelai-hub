import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserSubscription } from '@/lib/payments';
import { CreditCard, Calendar, Download } from 'lucide-react';
import { useSEO } from '@/lib/seo';
import { ProtectedRouteWithSubscription } from '@/components/ProtectedRouteWithSubscription';
import { useNavigate } from 'react-router-dom';

const Billing = () => {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'Billing - Payment Methods & Invoices',
    description: 'Manage your payment methods, view invoices, and update billing information.',
  });

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const sub = await getUserSubscription(user.id);
        setSubscription(sub);
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

  return (
    <ProtectedRouteWithSubscription requireSubscription>
      <div className="min-h-screen bg-background p-8">
        <div className="container mx-auto max-w-4xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-4xl font-bold">Billing</h1>
            <p className="text-muted-foreground">Manage your payment methods and billing information</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    <CardTitle>Payment Method</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Update your payment method for automatic renewals
                  </p>
                  <Button variant="outline" className="w-full">
                    Update Payment Method
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <CardTitle>Billing Cycle</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {subscription ? (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Next billing date</p>
                      <p className="font-medium">
                        {new Date(subscription.current_period_end).toLocaleDateString()}
                      </p>
                      <Button variant="outline" className="w-full mt-4">
                        Change Plan
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No active subscription
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View and download your invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => navigate('/payment-history')}>
                  View Payment History
                  <Download className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ProtectedRouteWithSubscription>
  );
};

export default Billing;

