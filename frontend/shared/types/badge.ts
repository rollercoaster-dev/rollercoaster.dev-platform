export enum BadgeStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

// Base requirement type without ID
export interface BadgeRequirementBase {
  description: string;
  completed: boolean;
}

// Full requirement type with ID
export interface BadgeRequirement extends BadgeRequirementBase {
  id: string;
}

// Base badge interface without system fields
export interface BadgeBase {
  name: string;
  description: string;
  content?: string;
  progress: number;
  status: BadgeStatus;
  startDate?: string;
  targetDate?: string;
}

// Complete badge interface with all fields
export interface Badge extends BadgeBase {
  id: string;
  requirements: BadgeRequirement[];
  createdAt: string;
  updatedAt: string;
  externalId?: string;
  externalSource?: string;
}

// DTO for creating a new badge
export interface CreateBadgeDto extends BadgeBase {
  requirements: BadgeRequirementBase[]; // Requirements without IDs for creation
}

// DTO for updating badge progress
export interface UpdateBadgeProgressDto {
  progress: number;
  status: BadgeStatus;
  requirements: Pick<BadgeRequirement, 'id' | 'completed'>[]; // Only need ID and completed status
}

// DTO for updating badge details
export type UpdateBadgeDto = Partial<Omit<Badge, 'id' | 'createdAt' | 'updatedAt' | 'externalId' | 'externalSource'>>; 