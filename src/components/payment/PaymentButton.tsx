import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, CreditCard, Smartphone, Building2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PaymentButtonProps {
  bookingId: string;
  amount: number;
  productInfo: string;
  onSuccess?: () => void;
  onFailure?: () => void;
}

export const PaymentButton = ({
  bookingId,
  amount,
  productInfo,
  onSuccess,
  onFailure,
}: PaymentButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'payu' | 'upi' | 'bank'>('payu');
  const [upiId, setUpiId] = useState('');

  const initiatePayuPayment = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to make a payment');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email, phone')
        .eq('id', user.id)
        .single();

      const response = await supabase.functions.invoke('payu-payment', {
        body: {
          action: 'create-payment',
          bookingId,
          amount: amount.toString(),
          productInfo,
          firstName: profile?.full_name || 'Customer',
          email: profile?.email || user.email,
          phone: profile?.phone || '9999999999',
          userId: user.id,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { paymentData } = response.data;

      // Create and submit PayU form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = paymentData.payuUrl;

      const fields = {
        key: paymentData.key,
        txnid: paymentData.txnid,
        amount: paymentData.amount,
        productinfo: paymentData.productinfo,
        firstname: paymentData.firstname,
        email: paymentData.email,
        phone: paymentData.phone,
        surl: paymentData.surl,
        furl: paymentData.furl,
        hash: paymentData.hash,
      };

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Failed to initiate payment');
      onFailure?.();
    } finally {
      setLoading(false);
    }
  };

  const handleUpiPayment = () => {
    if (!upiId || !upiId.includes('@')) {
      toast.error('Please enter a valid UPI ID');
      return;
    }
    
    // Generate UPI deep link
    const upiLink = `upi://pay?pa=merchant@payu&pn=GSMODELING&am=${amount}&cu=INR&tn=${encodeURIComponent(productInfo)}`;
    
    // Try to open UPI app
    window.location.href = upiLink;
    
    toast.info('Opening UPI app...', {
      description: 'Complete the payment in your UPI app',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full btn-premium">
          <CreditCard className="mr-2 h-5 w-5" />
          Pay ₹{amount.toLocaleString('en-IN')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">Choose Payment Method</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Payment Method Selection */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setPaymentMethod('payu')}
              className={`p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'payu' 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <CreditCard className="h-6 w-6 mx-auto mb-2" />
              <span className="text-xs font-medium">Card/NetBanking</span>
            </button>
            
            <button
              onClick={() => setPaymentMethod('upi')}
              className={`p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'upi' 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Smartphone className="h-6 w-6 mx-auto mb-2" />
              <span className="text-xs font-medium">UPI</span>
            </button>
            
            <button
              onClick={() => setPaymentMethod('bank')}
              className={`p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'bank' 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Building2 className="h-6 w-6 mx-auto mb-2" />
              <span className="text-xs font-medium">Bank Transfer</span>
            </button>
          </div>

          {/* Amount Display */}
          <div className="bg-muted/50 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Amount</span>
              <span className="text-2xl font-display font-bold">₹{amount.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{productInfo}</p>
          </div>

          {/* UPI ID Input */}
          {paymentMethod === 'upi' && (
            <div className="space-y-2">
              <Label htmlFor="upi-id">Enter UPI ID</Label>
              <Input
                id="upi-id"
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="h-12"
              />
              <div className="flex gap-2 flex-wrap">
                {['@paytm', '@gpay', '@ybl', '@phonepe'].map((suffix) => (
                  <button
                    key={suffix}
                    onClick={() => setUpiId((prev) => prev.split('@')[0] + suffix)}
                    className="text-xs px-3 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  >
                    {suffix}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bank Transfer Info */}
          {paymentMethod === 'bank' && (
            <div className="bg-muted/50 rounded-xl p-4 space-y-2 text-sm">
              <p className="font-medium">Bank Transfer Details:</p>
              <div className="space-y-1 text-muted-foreground">
                <p>Account Name: GSMODELING Pvt Ltd</p>
                <p>Account No: XXXX XXXX XXXX</p>
                <p>IFSC: XXXX0000XXX</p>
                <p>Bank: HDFC Bank</p>
              </div>
              <p className="text-xs text-accent">
                Share transaction ID after transfer for verification
              </p>
            </div>
          )}

          {/* Pay Button */}
          <Button
            onClick={paymentMethod === 'payu' ? initiatePayuPayment : handleUpiPayment}
            disabled={loading || (paymentMethod === 'bank')}
            className="w-full h-12 btn-premium"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : paymentMethod === 'bank' ? (
              'Transfer & Notify'
            ) : (
              `Pay ₹${amount.toLocaleString('en-IN')}`
            )}
          </Button>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
            <span>Secured by PayU • 256-bit SSL</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
