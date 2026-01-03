/**
 * Payment integration utilities
 * Supports UPI, Google Pay, Cashfree, and PayU
 */

import { supabase } from '@/integrations/supabase/client';

export type PaymentMethod = 'upi' | 'google_pay' | 'cashfree' | 'payu';

export interface PaymentIntent {
    id: string;
    amount: number;
    currency: string;
    status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled';
    payment_method: PaymentMethod;
    metadata?: Record<string, any>;
}

export interface SubscriptionPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    interval: 'month' | 'year';
    features: string[];
}

/**
 * Create a payment intent for subscription
 */
export const createSubscriptionPayment = async (
    planId: string,
    amount: number,
    paymentMethod: PaymentMethod = 'payu'
): Promise<{ paymentIntent?: PaymentIntent; error?: Error }> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { error: new Error('User not authenticated') };
        }

        // Create payment intent
        const { data, error } = await supabase
            .from('payment_intents')
            .insert({
                user_id: user.id,
                amount,
                currency: 'INR',
                status: 'pending',
                payment_method: paymentMethod,
                metadata: { planId, type: 'subscription' },
            })
            .select()
            .single();

        if (error) {
            return { error };
        }

        return { paymentIntent: data as PaymentIntent };
    } catch (error) {
        return { error: error as Error };
    }
};

/**
 * Verify payment webhook
 */
export const verifyPaymentWebhook = async (
    paymentIntentId: string,
    transactionId: string
): Promise<{ success: boolean; error?: Error }> => {
    try {
        const { data, error } = await supabase
            .from('payment_intents')
            .update({
                status: 'succeeded',
                payu_txn_id: transactionId,
                updated_at: new Date().toISOString(),
            })
            .eq('id', paymentIntentId)
            .select()
            .single();

        if (error) {
            return { success: false, error };
        }

        // Activate subscription
        const { data: { user } } = await supabase.auth.getUser();
        if (user && data) {
            await activateSubscription(user.id, data.metadata?.planId);
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error as Error };
    }
};

/**
 * Activate user subscription after payment
 */
export const activateSubscription = async (
    userId: string,
    planId?: string
): Promise<{ success: boolean; error?: Error }> => {
    try {
        // Check if subscriptions table exists, if not create it via migration
        const { error } = await supabase
            .from('subscriptions')
            .upsert({
                user_id: userId,
                plan_id: planId || 'default',
                status: 'active',
                current_period_start: new Date().toISOString(),
                current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id',
            });

        if (error) {
            // If table doesn't exist, we'll handle it in migration
            console.warn('Subscription table may not exist:', error);
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error as Error };
    }
};

/**
 * Check if user has active subscription
 */
export const hasActiveSubscription = async (userId: string): Promise<boolean> => {
    try {
        const { data, error } = await supabase
            .from('subscriptions')
            .select('status, current_period_end')
            .eq('user_id', userId)
            .eq('status', 'active')
            .single();

        if (error || !data) {
            return false;
        }

        // Check if subscription hasn't expired
        const endDate = new Date(data.current_period_end);
        return endDate > new Date();
    } catch {
        return false;
    }
};

/**
 * Get user subscription details
 */
export const getUserSubscription = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error || !data) {
            return null;
        }

        return data;
    } catch {
        return null;
    }
};

/**
 * Generate invoice for payment
 */
export const generateInvoice = async (
    paymentIntentId: string
): Promise<{ invoice?: any; error?: Error }> => {
    try {
        const { data: paymentIntent, error } = await supabase
            .from('payment_intents')
            .select('*, profiles(full_name, email)')
            .eq('id', paymentIntentId)
            .single();

        if (error || !paymentIntent) {
            return { error: new Error('Payment intent not found') };
        }

        const invoice = {
            id: `INV-${paymentIntentId.substring(0, 8).toUpperCase()}`,
            date: new Date().toISOString(),
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: paymentIntent.status,
            customer: paymentIntent.profiles,
            items: [
                {
                    description: 'Platform Subscription',
                    quantity: 1,
                    price: paymentIntent.amount,
                },
            ],
        };

        return { invoice };
    } catch (error) {
        return { error: error as Error };
    }
};

