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
 * Get environment from process
 */
const getEnvironment = (): Environment => {
  const env = (import.meta.env.VITE_APP_ENV || import.meta.env.MODE || 'development').toLowerCase();
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
    throw new Error(`Missing required configuration: ${missing.join(', ')}`);
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
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
      supabaseKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
      timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10),
      retries: parseInt(import.meta.env.VITE_API_RETRIES || '3', 10),
    },
    payments: {
      payu: {
        merchantKey: import.meta.env.VITE_PAYU_MERCHANT_KEY || '',
        merchantSalt: import.meta.env.VITE_PAYU_MERCHANT_SALT || '',
        enabled: import.meta.env.VITE_PAYU_ENABLED !== 'false',
      },
      cashfree: {
        appId: import.meta.env.VITE_CASHFREE_APP_ID || '',
        secretKey: import.meta.env.VITE_CASHFREE_SECRET_KEY || '',
        environment: (import.meta.env.VITE_CASHFREE_ENV || 'sandbox') as 'sandbox' | 'production',
        enabled: import.meta.env.VITE_CASHFREE_ENABLED !== 'false',
      },
    },
    ai: {
      provider: (import.meta.env.VITE_AI_PROVIDER || 'lovable') as 'openai' | 'anthropic' | 'lovable',
      apiKey: import.meta.env.VITE_AI_API_KEY || '',
      model: import.meta.env.VITE_AI_MODEL || 'gpt-4',
      maxTokens: parseInt(import.meta.env.VITE_AI_MAX_TOKENS || '1000', 10),
      rateLimit: parseInt(import.meta.env.VITE_AI_RATE_LIMIT || '20', 10),
    },
    security: {
      enableContentProtection: env === 'production',
      enableConsoleObfuscation: env === 'production',
      enableRateLimiting: true,
      maxLoginAttempts: parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS || '5', 10),
      sessionTimeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '3600000', 10),
    },
    monitoring: {
      enabled: env !== 'development',
      sentryDsn: import.meta.env.VITE_SENTRY_DSN,
      logLevel: (import.meta.env.VITE_LOG_LEVEL || (env === 'production' ? 'warn' : 'debug')) as 'debug' | 'info' | 'warn' | 'error',
    },
    features: {
      maintenanceMode: import.meta.env.VITE_MAINTENANCE_MODE === 'true',
      allowRegistrations: import.meta.env.VITE_ALLOW_REGISTRATIONS !== 'false',
      allowPayments: import.meta.env.VITE_ALLOW_PAYMENTS !== 'false',
    },
  };

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

