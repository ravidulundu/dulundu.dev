/**
 * Validation utilities
 */

/**
 * Validates and parses a date string
 * Returns a valid Date object or null if invalid
 */
export function parseDate(dateString: string | null | undefined): Date | null {
  if (!dateString) {
    return null;
  }

  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return null;
  }

  return date;
}

/**
 * Validates a date string and throws an error if invalid
 */
export function validateDate(dateString: string | null | undefined, fieldName: string = 'date'): Date | null {
  if (!dateString) {
    return null;
  }

  const date = parseDate(dateString);

  if (date === null) {
    throw new Error(`Invalid ${fieldName}: ${dateString}`);
  }

  return date;
}

/**
 * Validates that a date is in the past
 */
export function isDateInPast(date: Date): boolean {
  return date.getTime() < Date.now();
}

/**
 * Validates that a date is in the future
 */
export function isDateInFuture(date: Date): boolean {
  return date.getTime() > Date.now();
}

/**
 * Email validation regex (RFC 5322 simplified)
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates an email address format
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Validates and normalizes an email address
 * Returns normalized email or null if invalid
 */
export function validateEmail(email: string | null | undefined): string | null {
  if (!email) {
    return null;
  }

  const trimmed = email.trim().toLowerCase();

  if (!isValidEmail(trimmed)) {
    return null;
  }

  return trimmed;
}

/**
 * Validates a slug (URL-safe string)
 * Allows lowercase letters, numbers, and hyphens
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') {
    return false;
  }
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * Sanitizes a string to create a valid slug
 */
export function sanitizeSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
