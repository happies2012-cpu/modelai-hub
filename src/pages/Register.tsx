import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { createSubscriptionPayment } from '@/lib/payments';
import { Loader2, CreditCard, Smartphone, Building2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSEO } from '@/lib/seo';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'payu' | 'upi' | 'google_pay' | 'cashfree'>('payu');
  const [upiId, setUpiId] = useState('');

  const email = searchParams.get('email') || '';

  useSEO({
    title: 'Complete Registration - Choose Your Plan',
    description: 'Select your subscription plan and complete payment to activate your premium account.',
  });

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: 999,
      period: 'month',
      features: [
        'Full platform access',
        'AI chatbot support',
        'Community access',
        'Priority support',
      ],
    },
    {
      id: 'yearly',
      name: 'Annual Plan',
      price: 9999,
      period: 'year',
      originalPrice: 11988,
      savings: 'Save 17%',
      features: [
        'Everything in Monthly',
        '2 months free',
        'Exclusive content',
        'VIP community access',
      ],
    },
  ];

  const currentPlan = plans.find(p => p.id === selectedPlan) || plans[0];

  useEffect(() => {
    // Check if user is already logged in and has subscription
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { hasActiveSubscription } = await import('@/lib/payments');
        const hasSubscription = await hasActiveSubscription(session.user.id);
        if (hasSubscription) {
          navigate('/dashboard');
        }
      } else if (!email) {
        navigate('/login');
      }
    });
  }, [email, navigate]);

  const handlePayment = async () => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Error',
          description: 'Please sign in first',
          variant: 'destructive',
        });
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email, phone')
        .eq('id', user.id)
        .single();

      // Create payment intent
      const { paymentIntent, error } = await createSubscriptionPayment(
        selectedPlan,
        currentPlan.price,
        paymentMethod
      );

      if (error || !paymentIntent) {
        throw error || new Error('Failed to create payment');
      }

      // Redirect to payment gateway based on method
      if (paymentMethod === 'payu') {
        // PayU integration
        const response = await supabase.functions.invoke('payu-payment', {
          body: {
            action: 'create-payment',
            bookingId: null,
            amount: currentPlan.price.toString(),
            productInfo: `Subscription - ${currentPlan.name}`,
            firstName: profile?.full_name || 'Customer',
            email: profile?.email || user.email,
            phone: profile?.phone || '9999999999',
            userId: user.id,
          },
        });

        if (response.error) {
          throw response.error;
        }

        // Submit PayU form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = response.data.paymentData.payuUrl;

        Object.entries(response.data.paymentData).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value as string;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else if (paymentMethod === 'cashfree' || paymentMethod === 'upi' || paymentMethod === 'google_pay') {
        // Cashfree integration (supports UPI and Google Pay)
        const { createCashfreePayment } = await import('@/lib/payments/cashfree');
        const { paymentSession, error: cashfreeError } = await createCashfreePayment(
          currentPlan.price,
          profile?.full_name || 'Customer',
          profile?.email || user.email || '',
          profile?.phone || '9999999999',
          selectedPlan
        );

        if (cashfreeError || !paymentSession) {
          throw cashfreeError || new Error('Failed to create Cashfree payment session');
        }

        // Redirect to Cashfree payment page
        if (paymentSession.paymentUrl) {
          window.location.href = paymentSession.paymentUrl;
        } else {
          throw new Error('Payment URL not received');
        }
      } else {
        throw new Error('Unsupported payment method');
      }
    } catch (error: any) {
      const { formatErrorForUser } = await import('@/lib/error-handling');
      toast({
        title: 'Error',
        description: formatErrorForUser(error),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Registration</h1>
          <p className="text-muted-foreground">Choose your plan and activate your premium account</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Plan Selection */}
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-semibold mb-4 block">Select Plan</Label>
              <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPlan === plan.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value={plan.id} id={plan.id} />
                        <Label htmlFor={plan.id} className="font-semibold cursor-pointer">
                          {plan.name}
                        </Label>
                      </div>
                      {plan.savings && (
                        <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded">
                          {plan.savings}
                        </span>
                      )}
                    </div>
                    <div className="ml-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">₹{plan.price.toLocaleString()}</span>
                        <span className="text-muted-foreground">/{plan.period}</span>
                      </div>
                      {plan.originalPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          ₹{plan.originalPrice.toLocaleString()}
                        </div>
                      )}
                      <ul className="mt-3 space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Payment Method */}
            <div>
              <Label className="text-lg font-semibold mb-4 block">Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
                <div className="space-y-3">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === 'payu'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setPaymentMethod('payu')}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="payu" id="payu" />
                      <CreditCard className="w-5 h-5" />
                      <Label htmlFor="payu" className="cursor-pointer">Credit/Debit Card</Label>
                    </div>
                  </div>
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === 'cashfree'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setPaymentMethod('cashfree')}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="cashfree" id="cashfree" />
                      <Smartphone className="w-5 h-5" />
                      <Label htmlFor="cashfree" className="cursor-pointer">Cashfree (UPI/Google Pay/Cards)</Label>
                    </div>
                  </div>
                </div>
              </RadioGroup>

              {paymentMethod === 'cashfree' && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Cashfree supports UPI, Google Pay, credit/debit cards, and net banking. 
                  You'll be redirected to choose your preferred method.
                </p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium">{currentPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Billing Period</span>
                  <span className="font-medium">Per {currentPlan.period}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{currentPlan.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={handlePayment}
              disabled={loading || (paymentMethod === 'upi' && !upiId)}
              className="w-full h-12 text-lg"
              size="lg"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Proceed to Payment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By proceeding, you agree to our{' '}
              <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

