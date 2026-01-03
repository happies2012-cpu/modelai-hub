import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowRight, RefreshCw, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Update payment status
    const updatePayment = async () => {
      const txnId = searchParams.get('txnid');
      if (txnId) {
        await supabase.functions.invoke('payu-payment', {
          body: {
            action: 'verify-payment',
            txnId,
            status: 'failed',
            payuResponse: Object.fromEntries(searchParams.entries()),
          },
        });
      }
    };

    updatePayment();
  }, [searchParams]);

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi, I need help with a failed payment. Transaction ID: ${searchParams.get('txnid') || 'N/A'}`
    );
    window.open(`https://wa.me/91888416299?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-destructive/20 flex items-center justify-center"
        >
          <XCircle className="h-12 w-12 text-destructive" />
        </motion.div>

        <h1 className="text-3xl font-display font-bold mb-2">Payment Failed</h1>
        <p className="text-muted-foreground mb-8">
          We couldn't process your payment. Don't worry, no amount has been deducted from your account.
        </p>

        <div className="bg-card rounded-xl p-6 mb-6 border border-border/50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-muted-foreground">Transaction ID</span>
            <span className="font-mono text-sm">{searchParams.get('txnid') || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Error</span>
            <span className="text-sm text-destructive">
              {searchParams.get('error_Message') || 'Transaction cancelled'}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => navigate(-1)}
            className="w-full h-12 btn-premium"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          
          <Button
            variant="outline"
            className="w-full h-12"
            onClick={openWhatsApp}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Get Help on WhatsApp
          </Button>
          
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => navigate('/dashboard')}
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentFailure;
