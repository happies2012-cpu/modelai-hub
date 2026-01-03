/**
 * Rate limiting utilities
 * Prevents abuse of forms and API endpoints
 */

import { supabase } from '@/integrations/supabase/client';

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  endpoint: string;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60000, // 1 minute
  endpoint: 'default',
};

/**
 * Check and update rate limit
 */
export const checkRateLimit = async (
  userId: string,
  config: Partial<RateLimitConfig> = {}
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const windowStart = new Date(Date.now() - finalConfig.windowMs);

  try {
    // Get current count for this window
    const { data: existing, error: fetchError } = await supabase
      .from('rate_limits')
      .select('count, window_start')
      .eq('user_id', userId)
      .eq('endpoint', finalConfig.endpoint)
      .gte('window_start', windowStart.toISOString())
      .order('window_start', { ascending: false })
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is "not found" which is fine
      console.error('Rate limit check error:', fetchError);
      return { allowed: true, remaining: finalConfig.maxRequests, resetAt: new Date(Date.now() + finalConfig.windowMs) };
    }

    if (existing) {
      const count = existing.count || 0;
      if (count >= finalConfig.maxRequests) {
        const resetAt = new Date(new Date(existing.window_start).getTime() + finalConfig.windowMs);
        return { allowed: false, remaining: 0, resetAt };
      }

      // Increment count
      const { error: updateError } = await supabase
        .from('rate_limits')
        .update({ count: count + 1 })
        .eq('user_id', userId)
        .eq('endpoint', finalConfig.endpoint)
        .eq('window_start', existing.window_start);

      if (updateError) {
        console.error('Rate limit update error:', updateError);
      }

      return {
        allowed: true,
        remaining: finalConfig.maxRequests - count - 1,
        resetAt: new Date(new Date(existing.window_start).getTime() + finalConfig.windowMs),
      };
    }

    // Create new rate limit entry
    const { error: insertError } = await supabase
      .from('rate_limits')
      .insert({
        user_id: userId,
        endpoint: finalConfig.endpoint,
        count: 1,
        window_start: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Rate limit insert error:', insertError);
    }

    return {
      allowed: true,
      remaining: finalConfig.maxRequests - 1,
      resetAt: new Date(Date.now() + finalConfig.windowMs),
    };
  } catch (error) {
    console.error('Rate limit error:', error);
    // Fail open - allow request if rate limiting fails
    return { allowed: true, remaining: finalConfig.maxRequests, resetAt: new Date(Date.now() + finalConfig.windowMs) };
  }
};

/**
 * Rate limit configuration for different endpoints
 */
export const RATE_LIMITS = {
  AI_CHAT: { maxRequests: 20, windowMs: 60000, endpoint: 'ai-chat' },
  CONTACT_FORM: { maxRequests: 5, windowMs: 3600000, endpoint: 'contact-form' }, // 5 per hour
  PAYMENT: { maxRequests: 10, windowMs: 60000, endpoint: 'payment' },
  LOGIN: { maxRequests: 5, windowMs: 900000, endpoint: 'login' }, // 5 per 15 minutes
} as const;

