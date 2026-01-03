/**
 * Monitoring and observability system
 * Centralized logging, error tracking, and metrics
 */

import { getConfig } from '../config';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  [key: string]: any;
}

class MonitoringService {
  private config = getConfig();
  private sessionId: string;
  private requestCounter = 0;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${++this.requestCounter}`;
  }

  /**
   * Log message with context
   */
  log(level: LogLevel, message: string, context?: LogContext): void {
    const config = getConfig();
    
    // Filter by log level
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(config.monitoring.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    
    if (messageLevelIndex < currentLevelIndex) {
      return; // Don't log below configured level
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      sessionId: this.sessionId,
      requestId: context?.requestId || this.generateRequestId(),
      ...context,
      environment: config.environment,
    };

    // Console logging (only in development or if explicitly enabled)
    if (config.environment === 'development' || config.monitoring.logLevel === 'debug') {
      const consoleMethod = console[level] || console.log;
      consoleMethod(`[${level.toUpperCase()}]`, message, context);
    }

    // Send to monitoring service (Sentry, etc.)
    if (config.monitoring.enabled && level === 'error') {
      this.sendToMonitoring(logEntry);
    }

    // Send to backend for persistence
    this.persistLog(logEntry);
  }

  /**
   * Send error to monitoring service (Sentry)
   */
  private async sendToMonitoring(logEntry: any): Promise<void> {
    if (!this.config.monitoring.sentryDsn) {
      return;
    }

    try {
      // In a real implementation, initialize Sentry here
      // For now, we'll just prepare the structure
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(new Error(logEntry.message), {
          extra: logEntry,
        });
      }
    } catch (error) {
      // Fail silently - don't break app if monitoring fails
      console.error('Failed to send to monitoring:', error);
    }
  }

  /**
   * Persist log to backend
   */
  private async persistLog(logEntry: any): Promise<void> {
    if (this.config.environment === 'development') {
      return; // Don't persist in development
    }

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      await supabase
        .from('audit_logs')
        .insert({
          action: `log_${logEntry.level}`,
          details: logEntry,
          created_at: logEntry.timestamp,
        });
    } catch (error) {
      // Fail silently - don't break app if logging fails
    }
  }

  /**
   * Track performance metric
   */
  trackMetric(name: string, value: number, tags?: Record<string, string>): void {
    this.log('info', `Metric: ${name}`, {
      metric: name,
      value,
      tags,
      type: 'metric',
    });
  }

  /**
   * Track user event
   */
  trackEvent(eventName: string, properties?: Record<string, any>): void {
    this.log('info', `Event: ${eventName}`, {
      event: eventName,
      properties,
      type: 'event',
    });
  }

  /**
   * Track API call
   */
  trackApiCall(endpoint: string, method: string, duration: number, status: number): void {
    this.trackMetric('api_call_duration', duration, {
      endpoint,
      method,
      status: status.toString(),
    });

    if (status >= 400) {
      this.log('warn', `API Error: ${method} ${endpoint}`, {
        endpoint,
        method,
        status,
        duration,
        type: 'api_error',
      });
    }
  }

  /**
   * Track error with full context
   */
  trackError(error: Error, context?: LogContext): void {
    this.log('error', error.message, {
      ...context,
      error: {
        name: error.name,
        message: error.message,
        stack: this.config.environment === 'development' ? error.stack : undefined,
      },
      type: 'error',
    });
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: Record<string, boolean>;
  }> {
    const checks: Record<string, boolean> = {
      config: true,
      monitoring: this.config.monitoring.enabled,
    };

    // Check Supabase connection
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase.from('profiles').select('id').limit(1);
      checks.database = !error;
    } catch {
      checks.database = false;
    }

    const allHealthy = Object.values(checks).every(v => v);
    const anyHealthy = Object.values(checks).some(v => v);

    return {
      status: allHealthy ? 'healthy' : anyHealthy ? 'degraded' : 'unhealthy',
      checks,
    };
  }
}

// Singleton instance
export const monitoring = new MonitoringService();

// Convenience functions
export const log = {
  debug: (message: string, context?: LogContext) => monitoring.log('debug', message, context),
  info: (message: string, context?: LogContext) => monitoring.log('info', message, context),
  warn: (message: string, context?: LogContext) => monitoring.log('warn', message, context),
  error: (message: string, context?: LogContext) => monitoring.log('error', message, context),
};

export const track = {
  metric: (name: string, value: number, tags?: Record<string, string>) => 
    monitoring.trackMetric(name, value, tags),
  event: (eventName: string, properties?: Record<string, any>) => 
    monitoring.trackEvent(eventName, properties),
  apiCall: (endpoint: string, method: string, duration: number, status: number) => 
    monitoring.trackApiCall(endpoint, method, duration, status),
  error: (error: Error, context?: LogContext) => 
    monitoring.trackError(error, context),
};

