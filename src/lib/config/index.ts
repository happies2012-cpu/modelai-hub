/**
 * Environment-based configuration system
 * Centralized configuration management with validation
 */

type Environment = 'development' | 'staging' | 'production';

interface AppConfig {
  environment: Environment;
  api: {
    supabaseUrl: string;
    supabaseKey: string;
    timeout: number;
    retries: number;
  };
  payments: {
    payu: {
      merchantKey: string;
      merchantSalt: string;
      enabled: boolean;
    };
    cashfree: {
      appId: string;
      secretKey: string;
      environment: 'sandbox' | 'production';
      enabled: boolean;
    };
  };
  ai: {
    provider: 'openai' | 'anthropic' | 'lovable';
    apiKey: string;
    model: string;
    maxTokens: number;
    rateLimit: number;
  };
  security: {
    enableContentProtection: boolean;
    enableConsoleObfuscation: boolean;
    enableRateLimiting: boolean;
    maxLoginAttempts: number;
    sessionTimeout: number;
  };
  monitoring: {
    enabled: boolean;
    sentryDsn?: string;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
  features: {
    maintenanceMode: boolean;
    allowRegistrations: boolean;
    allowPayments: boolean;
  };
}

/**
 * Read a Vite-style env var from runtime (window.__ENV__) first, then build-time (import.meta.env).
 * This is required for Docker/Coolify where runtime env vars are not available at Vite build time.
 */
const getEnvVar = (key: string): string | undefined => {
  const runtime = typeof window !== 'undefined' ? window.__ENV__ : undefined;
  const runtimeValue = runtime?.[key];
  if (typeof runtimeValue === 'string' && runtimeValue.length > 0) return runtimeValue;
  return (import.meta as any).env?.[key];
};

/**
 * Get environment from process
 */
const getEnvironment = (): Environment => {
  const envRaw = (getEnvVar('VITE_APP_ENV') || import.meta.env.MODE || 'development');
  const env = String(envRaw).toLowerCase();
  if (env === 'prod' || env === 'production') return 'production';
  if (env === 'stage' || env === 'staging') return 'staging';
  return 'development';
};

/**
 * Validate required environment variables
 */
const validateConfig = (config: Partial<AppConfig>): void => {
  const required = [
    'api.supabaseUrl',
    'api.supabaseKey',
  ];

  const missing: string[] = [];

  required.forEach(path => {
    const keys = path.split('.');
    let value: any = config;
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) {
        missing.push(path);
        break;
      }
    }
  });

  if (missing.length > 0) {
    // Don't hard-crash the entire app; surface a clear error and allow UI to load.
    // Missing Supabase config will disable auth/payments/features that depend on Supabase.
    console.error(`Missing required configuration: ${missing.join(', ')}`);
  }
};

/**
 * Load configuration from environment variables
 */
export const loadConfig = (): AppConfig => {
  const env = getEnvironment();

  const config: AppConfig = {
    environment: env,
    api: {
      supabaseUrl: getEnvVar('VITE_SUPABASE_URL') || '',
      supabaseKey: getEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY') || '',
      timeout: parseInt(getEnvVar('VITE_API_TIMEOUT') || '30000', 10),
      retries: parseInt(getEnvVar('VITE_API_RETRIES') || '3', 10),
    },
    payments: {
      payu: {
        merchantKey: getEnvVar('VITE_PAYU_MERCHANT_KEY') || '',
        merchantSalt: getEnvVar('VITE_PAYU_MERCHANT_SALT') || '',
        enabled: getEnvVar('VITE_PAYU_ENABLED') !== 'false',
      },
      cashfree: {
        appId: getEnvVar('VITE_CASHFREE_APP_ID') || '',
        secretKey: getEnvVar('VITE_CASHFREE_SECRET_KEY') || '',
        environment: (getEnvVar('VITE_CASHFREE_ENV') || 'sandbox') as 'sandbox' | 'production',
        enabled: getEnvVar('VITE_CASHFREE_ENABLED') !== 'false',
      },
    },
    ai: {
      provider: (getEnvVar('VITE_AI_PROVIDER') || 'lovable') as 'openai' | 'anthropic' | 'lovable',
      apiKey: getEnvVar('VITE_AI_API_KEY') || '',
      model: getEnvVar('VITE_AI_MODEL') || 'gpt-4',
      maxTokens: parseInt(getEnvVar('VITE_AI_MAX_TOKENS') || '1000', 10),
      rateLimit: parseInt(getEnvVar('VITE_AI_RATE_LIMIT') || '20', 10),
    },
    security: {
      enableContentProtection: env === 'production',
      enableConsoleObfuscation: env === 'production',
      enableRateLimiting: true,
      maxLoginAttempts: parseInt(getEnvVar('VITE_MAX_LOGIN_ATTEMPTS') || '5', 10),
      sessionTimeout: parseInt(getEnvVar('VITE_SESSION_TIMEOUT') || '3600000', 10),
    },
    monitoring: {
      enabled: env !== 'development',
      sentryDsn: getEnvVar('VITE_SENTRY_DSN'),
      logLevel: (getEnvVar('VITE_LOG_LEVEL') || (env === 'production' ? 'warn' : 'debug')) as 'debug' | 'info' | 'warn' | 'error',
    },
    features: {
      maintenanceMode: getEnvVar('VITE_MAINTENANCE_MODE') === 'true',
      allowRegistrations: getEnvVar('VITE_ALLOW_REGISTRATIONS') !== 'false',
      allowPayments: getEnvVar('VITE_ALLOW_PAYMENTS') !== 'false',
    },
  };

  // If Supabase isn't configured, disable payments by default (prevents broken payment UX).
  if (!config.api.supabaseUrl || !config.api.supabaseKey) {
    config.features.allowPayments = false;
  }

  // Validate in production
  if (env === 'production') {
    validateConfig(config);
  }

  return config;
};

/**
 * Get current configuration (singleton)
 */
let cachedConfig: AppConfig | null = null;

export const getConfig = (): AppConfig => {
  if (!cachedConfig) {
    cachedConfig = loadConfig();
  }
  return cachedConfig;
};

/**
 * Reload configuration (useful for testing)
 */
export const reloadConfig = (): AppConfig => {
  cachedConfig = null;
  return getConfig();
};

