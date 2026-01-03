import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#f97316', '#06b6d4'],
    });

    // Verify payment
    const verifyPayment = async () => {
      const txnId = searchParams.get('txnid');
      if (txnId) {
        await supabase.functions.invoke('payu-payment', {
          body: {
            action: 'verify-payment',
            txnId,
            status: 'success',
            payuResponse: Object.fromEntries(searchParams.entries()),
          },
        });
      }
      setVerifying(false);
    };

    verifyPayment();
  }, [searchParams]);

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
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
        >
          <CheckCircle className="h-12 w-12 text-green-500" />
        </motion.div>

        <h1 className="text-3xl font-display font-bold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground mb-8">
          Your booking has been confirmed. You will receive a confirmation email shortly.
        </p>

        <div className="bg-card rounded-xl p-6 mb-6 border border-border/50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-muted-foreground">Transaction ID</span>
            <span className="font-mono text-sm">{searchParams.get('txnid') || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Amount Paid</span>
            <span className="text-xl font-display font-bold text-green-500">
              ₹{searchParams.get('amount') || '0'}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => navigate('/dashboard')}
            className="w-full h-12 btn-premium"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            className="w-full h-12"
            onClick={() => window.print()}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Receipt
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
