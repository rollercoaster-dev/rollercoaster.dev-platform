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
  // External references for badge-engine integration
  externalId?: string;
  externalSource?: string;
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

// Used for file system exploration in VSCode-like UI
export interface BadgeProject {
  id: string;
  name: string;
  type: 'folder' | 'badge' | 'file' | 'image';
  children?: BadgeProject[];
  expanded?: boolean;
  progress?: number;
  content?: string;
  badge?: Badge; // Reference to the actual badge data when type is 'badge'
  path?: string; // File path or folder path for navigation
}

// Message type for AI assistant chat
export interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  relatedBadgeId?: string; // Optional badge reference
}

// Used for display in VSCode-like editor tabs
export interface BadgeTab {
  id: string;
  badgeId: string;
  title: string;
  type: 'badge' | 'requirements' | 'progress' | 'notes';
  active: boolean;
}