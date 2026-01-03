/**
 * Error handling and logging utilities
 * Centralized error management for production
 */

import { supabase } from '@/integrations/supabase/client';

export interface ErrorLog {
  level: 'error' | 'warn' | 'info';
  message: string;
  error?: Error;
  context?: Record<string, any>;
  userId?: string;
  url?: string;
  userAgent?: string;
}

/**
 * Log error to database and console
 */
export const logError = async (log: ErrorLog): Promise<void> => {
  try {
    // Get user if available
    const { data: { user } } = await supabase.auth.getUser();
    
    // Create audit log entry
    await supabase
      .from('audit_logs')
      .insert({
        user_id: user?.id || null,
        action: `error_${log.level}`,
        resource_type: 'error',
        details: {
          message: log.message,
          error: log.error ? {
            name: log.error.name,
            message: log.error.message,
            stack: import.meta.env.MODE === 'development' ? log.error.stack : undefined,
          } : undefined,
          context: log.context,
          url: log.url || (typeof window !== 'undefined' ? window.location.href : undefined),
          userAgent: log.userAgent || (typeof window !== 'undefined' ? navigator.userAgent : undefined),
        },
        ip_address: null, // Would need server-side to get real IP
        user_agent: log.userAgent || (typeof window !== 'undefined' ? navigator.userAgent : undefined),
      });

    // Console logging (only in development)
    if (import.meta.env.MODE === 'development') {
      const consoleMethod = log.level === 'error' ? console.error : 
                           log.level === 'warn' ? console.warn : console.info;
      consoleMethod(`[${log.level.toUpperCase()}]`, log.message, log.error || log.context);
    }
  } catch (error) {
    // Fallback to console if database logging fails
    console.error('Failed to log error:', error);
    if (import.meta.env.MODE === 'development') {
      console.error('Original error:', log);
    }
  }
};

/**
 * Handle API errors gracefully
 */
export const handleApiError = (error: unknown, context?: string): Error => {
  let errorMessage = 'An unexpected error occurred';
  let errorObj: Error;

  if (error instanceof Error) {
    errorObj = error;
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorObj = new Error(error);
    errorMessage = error;
  } else {
    errorObj = new Error('Unknown error');
  }

  // Log error
  logError({
    level: 'error',
    message: context ? `${context}: ${errorMessage}` : errorMessage,
    error: errorObj,
    context: { originalError: error },
  });

  return errorObj;
};

/**
 * Safe async wrapper with error handling
 */
export const safeAsync = async <T>(
  fn: () => Promise<T>,
  fallback: T,
  context?: string
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    handleApiError(error, context);
    return fallback;
  }
};

/**
 * Error boundary helper
 */
export const formatErrorForUser = (error: Error): string => {
  // Don't expose internal errors to users
  if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  if (error.message.includes('rate limit') || error.message.includes('429')) {
    return 'Too many requests. Please wait a moment and try again.';
  }

  if (error.message.includes('unauthorized') || error.message.includes('401')) {
    return 'Please sign in to continue.';
  }

  if (error.message.includes('forbidden') || error.message.includes('403')) {
    return 'You don\'t have permission to perform this action.';
  }

  // Generic error message
  return 'Something went wrong. Please try again or contact support if the problem persists.';
};

