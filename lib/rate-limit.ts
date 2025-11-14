/**
 * Rate limiting utility using Upstash Redis
 * Provides protection against DoS attacks and abuse
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis client (in-memory fallback for development)
let redis: Redis | null = null;

try {
  // Only initialize if environment variables are set (production)
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
} catch (error) {
  console.warn('Rate limiting not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN for production.');
}

// In-memory store for development (not recommended for production)
class MemoryStore {
  private store: Map<string, { count: number; reset: number }> = new Map();

  async incr(key: string): Promise<number> {
    const now = Date.now();
    const item = this.store.get(key);

    if (!item || item.reset < now) {
      this.store.set(key, { count: 1, reset: now + 60000 }); // 1 minute window
      return 1;
    }

    item.count++;
    return item.count;
  }

  async get(key: string): Promise<number | null> {
    const item = this.store.get(key);
    if (!item || item.reset < Date.now()) {
      return null;
    }
    return item.count;
  }
}

const memoryStore = new MemoryStore();

// Rate limiters for different endpoints
export const inquiryRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
      analytics: true,
      prefix: '@ratelimit/inquiry',
    })
  : null;

export const checkoutRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(2, '1 m'), // 2 requests per minute
      analytics: true,
      prefix: '@ratelimit/checkout',
    })
  : null;

export const apiRateLimiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, '15 m'), // 100 requests per 15 minutes
      analytics: true,
      prefix: '@ratelimit/api',
    })
  : null;

/**
 * Rate limit check with in-memory fallback for development
 */
export async function checkRateLimit(
  identifier: string,
  limiter: Ratelimit | null,
  maxRequests: number = 10
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  // Production mode with Redis
  if (limiter) {
    const result = await limiter.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  }

  // Development mode with in-memory store
  const count = await memoryStore.incr(identifier);
  const remaining = Math.max(0, maxRequests - count);
  const reset = Date.now() + 60000;

  return {
    success: count <= maxRequests,
    limit: maxRequests,
    remaining,
    reset,
  };
}

/**
 * Extract IP address from request (works with Vercel, Cloudflare, and direct connections)
 */
export function getClientIp(request: Request): string {
  const headers = new Headers(request.headers);

  // Try various headers in order of preference
  const ip =
    headers.get('x-real-ip') ||
    headers.get('x-forwarded-for')?.split(',')[0] ||
    headers.get('cf-connecting-ip') || // Cloudflare
    headers.get('x-vercel-forwarded-for')?.split(',')[0] || // Vercel
    'unknown';

  return ip;
}
