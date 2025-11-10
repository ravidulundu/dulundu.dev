/**
 * Environment variable validation
 * Validates required environment variables at application startup
 */

interface EnvVars {
  DATABASE_URL: string;
  NEXTAUTH_URL: string;
  NEXTAUTH_SECRET: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string;
}

class EnvValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvValidationError';
  }
}

/**
 * Validates that a required environment variable is set
 */
function requireEnv(name: keyof EnvVars, value: string | undefined): string {
  if (!value || value.trim() === '') {
    throw new EnvValidationError(
      `Missing required environment variable: ${name}\n` +
      `Please set ${name} in your .env file or environment.`
    );
  }
  return value;
}

/**
 * Validates all required environment variables
 * Call this at application startup to fail fast if env is misconfigured
 */
export function validateEnv() {
  const errors: string[] = [];

  try {
    requireEnv('DATABASE_URL', process.env.DATABASE_URL);
  } catch (err) {
    errors.push((err as Error).message);
  }

  try {
    requireEnv('NEXTAUTH_URL', process.env.NEXTAUTH_URL);
  } catch (err) {
    errors.push((err as Error).message);
  }

  try {
    requireEnv('NEXTAUTH_SECRET', process.env.NEXTAUTH_SECRET);
  } catch (err) {
    errors.push((err as Error).message);
  }

  if (errors.length > 0) {
    throw new EnvValidationError(
      'Environment validation failed:\n' + errors.join('\n')
    );
  }
}

/**
 * Get a required environment variable
 * Throws if not set
 */
export function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new EnvValidationError(
      `Missing required environment variable: ${name}`
    );
  }
  return value;
}

/**
 * Get an optional environment variable with a default
 */
export function getOptionalEnv(name: string, defaultValue: string = ''): string {
  return process.env[name] || defaultValue;
}
