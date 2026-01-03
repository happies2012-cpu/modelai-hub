/**
 * Cashfree payment integration
 * Supports UPI, Google Pay, and other Cashfree payment methods
 */

import { supabase } from '@/integrations/supabase/client';

export interface CashfreePaymentRequest {
  orderId: string;
  orderAmount: number;
  orderCurrency: string;
  customerDetails: {
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  };
  orderMeta: {
    returnUrl: string;
    notifyUrl: string;
  };
}

export interface CashfreePaymentResponse {
  paymentSessionId: string;
  paymentUrl: string;
  orderToken: string;
}

/**
 * Create Cashfree payment session
 */
export const createCashfreePayment = async (
  amount: number,
  customerName: string,
  customerEmail: string,
  customerPhone: string,
  planId: string
): Promise<{ paymentSession?: CashfreePaymentResponse; error?: Error }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Create payment intent first
    const { data: paymentIntent, error: intentError } = await supabase
      .from('payment_intents')
      .insert({
        user_id: user.id,
        amount,
        currency: 'INR',
        status: 'pending',
        payment_method: 'cashfree',
        metadata: { planId, orderId, type: 'subscription' },
      })
      .select()
      .single();

    if (intentError || !paymentIntent) {
      return { error: intentError || new Error('Failed to create payment intent') };
    }

    // Call Cashfree Edge Function
    const { data, error } = await supabase.functions.invoke('cashfree-payment', {
      body: {
        action: 'create-session',
        orderId,
        orderAmount: amount,
        orderCurrency: 'INR',
        customerDetails: {
          customerId: user.id,
          customerName,
          customerEmail,
          customerPhone,
        },
        orderMeta: {
          returnUrl: `${window.location.origin}/payment/success?payment_intent_id=${paymentIntent.id}`,
          notifyUrl: `${window.location.origin}/api/webhooks/cashfree`,
        },
        paymentIntentId: paymentIntent.id,
      },
    });

    if (error) {
      return { error };
    }

    return { paymentSession: data };
  } catch (error) {
    return { error: error as Error };
  }
};

/**
 * Verify Cashfree webhook
 */
export const verifyCashfreeWebhook = async (
  paymentIntentId: string,
  orderId: string,
  paymentStatus: string
): Promise<{ success: boolean; error?: Error }> => {
  try {
    // Verify with Cashfree Edge Function
    const { data, error } = await supabase.functions.invoke('cashfree-payment', {
      body: {
        action: 'verify-webhook',
        paymentIntentId,
        orderId,
        paymentStatus,
      },
    });

    if (error) {
      return { success: false, error };
    }

    if (data.verified && paymentStatus === 'SUCCESS') {
      // Update payment intent
      const { error: updateError } = await supabase
        .from('payment_intents')
        .update({
          status: 'succeeded',
          payu_txn_id: orderId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', paymentIntentId);

      if (updateError) {
        return { success: false, error: updateError };
      }

      // Activate subscription
      const { data: paymentIntent } = await supabase
        .from('payment_intents')
        .select('user_id, metadata')
        .eq('id', paymentIntentId)
        .single();

      if (paymentIntent) {
        const { activateSubscription } = await import('./index');
        await activateSubscription(paymentIntent.user_id, paymentIntent.metadata?.planId);
      }
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error as Error };
  }
};

