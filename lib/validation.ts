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
