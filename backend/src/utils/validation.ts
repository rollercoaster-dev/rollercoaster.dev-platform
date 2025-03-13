import type { Badge } from '@/types/badge';

/**
 * Validates a badge object against business rules.
 * Returns validation result with any error messages.
 */
export const validateBadge = (badge: Partial<Badge>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!badge.name) {
    errors.push('Badge name is required');
  } else if (badge.name.length < 3) {
    errors.push('Badge name must be at least 3 characters long');
  }

  if (!badge.description) {
    errors.push('Badge description is required');
  }

  if (badge.progress !== undefined && (badge.progress < 0 || badge.progress > 100)) {
    errors.push('Badge progress must be between 0 and 100');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}; 