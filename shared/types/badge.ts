/**
 * Badge Type Definitions
 * These types are shared between frontend and backend
 */

// Badge requirement interface
export interface BadgeRequirement {
  id: string;
  description: string;
  completed: boolean;
}

// Badge status enum
export enum BadgeStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED'
}

// Badge base interface
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
  // External references for badge-engine integration
  externalId?: string;
  externalSource?: string;
}

// Type aliases for badge-engine compatibility
export type BadgeEngineRequirement = BadgeRequirement;
export type BadgeEngineStatus = BadgeStatus;
export type BadgeEngineBase = Badge;

// DTO for creating a new badge
export interface CreateBadgeDto {
  name: string;
  description: string;
  content?: string;
  progress?: number;
  status?: BadgeStatus;
  requirements: BadgeRequirement[];
  startDate?: string;
  targetDate?: string;
}

// DTO for updating badge progress
export interface UpdateBadgeProgressDto {
  progress?: number;
  requirements?: {
    id: string;
    completed: boolean;
  }[];
}

// DTO for updating badge details
export interface UpdateBadgeDto extends Partial<CreateBadgeDto> {
  // Allows partial updates of any badge field except id
} 