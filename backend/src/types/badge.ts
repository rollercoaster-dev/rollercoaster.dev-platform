/**
 * Badge status enumeration.
 * Represents the current state of a badge in the system.
 */
export enum BadgeStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

/**
 * Badge requirement interface.
 * Defines a single requirement that must be met to complete a badge.
 */
export interface BadgeRequirement {
  id: string;
  description: string;
  completed: boolean;
}

/**
 * Badge interface.
 * Represents a badge in the system with all its properties.
 */
export interface Badge {
  id: string;
  name: string;
  description: string;
  content?: string;
  progress: number;
  status: BadgeStatus;
  requirements: BadgeRequirement[];
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  targetDate?: string;
  externalId?: string;
  externalSource?: string;
}

/**
 * Data transfer object for creating a new badge.
 * Contains only the fields needed for badge creation.
 */
export interface CreateBadgeDto {
  name: string;
  description: string;
  content?: string;
  progress?: number;
  status?: BadgeStatus;
  requirements?: BadgeRequirement[];
  startDate?: string;
  targetDate?: string;
}

/**
 * Data transfer object for updating badge progress.
 * Contains only the fields related to progress updates.
 */
export interface UpdateBadgeProgressDto {
  progress: number;
  requirements?: BadgeRequirement[];
} 