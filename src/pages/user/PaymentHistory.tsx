import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Calendar, CreditCard, CheckCircle2, XCircle } from 'lucide-react';
import { useSEO } from '@/lib/seo';
import { ProtectedRouteWithSubscription } from '@/components/ProtectedRouteWithSubscription';
import { generateInvoice } from '@/lib/payments';

const PaymentHistory = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: 'Payment History - Invoices & Transactions',
    description: 'View your complete payment history and download invoices.',
  });

  useEffect(() => {
    const loadPayments = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('payment_intents')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setPayments(data);
        }
      }
      setLoading(false);
    };
    loadPayments();
  }, []);

  const handleDownloadInvoice = async (paymentId: string) => {
    const { invoice } = await generateInvoice(paymentId);
    if (invoice) {
      // Create and download invoice PDF
      const blob = new Blob([JSON.stringify(invoice, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoice.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

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
            <h1 className="text-4xl font-bold">Payment History</h1>
            <p className="text-muted-foreground">View all your transactions and invoices</p>
          </motion.div>

          {payments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No payment history found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {payments.map((payment, index) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {payment.status === 'succeeded' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-destructive" />
                            )}
                            <span className="font-semibold">
                              ₹{parseFloat(payment.amount).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(payment.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <CreditCard className="w-4 h-4" />
                              {payment.payment_method || 'N/A'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            payment.status === 'succeeded'
                              ? 'bg-green-500/20 text-green-600'
                              : payment.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-600'
                              : 'bg-destructive/20 text-destructive'
                          }`}>
                            {payment.status}
                          </span>
                          {payment.status === 'succeeded' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadInvoice(payment.id)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRouteWithSubscription>
  );
};

export default PaymentHistory;

