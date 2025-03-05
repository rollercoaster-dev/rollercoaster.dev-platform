/**
 * Badge Type Definitions
 * These types are shared between frontend and backend
 */

// Badge progress status
export enum BadgeStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

// Badge requirement definition
export interface BadgeRequirement {
  id: string;
  description: string;
  completed: boolean;
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
}

// For creating a new badge
export type CreateBadgeDto = Omit<Badge, 'id' | 'createdAt' | 'updatedAt'>;

// For updating badge progress
export interface UpdateBadgeProgressDto {
  progress: number;
  requirements?: {
    id: string;
    completed: boolean;
  }[];
} 