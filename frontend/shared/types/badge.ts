export enum BadgeStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface BadgeRequirement {
  id: string;
  description: string;
  completed: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  content?: string;
  startDate?: string;
  targetDate?: string;
  progress: number;
  status: BadgeStatus;
  requirements: BadgeRequirement[];
}

export interface CreateBadgeDto {
  name: string;
  description: string;
  content?: string;
  startDate?: string;
  targetDate?: string;
  progress: number;
  status: BadgeStatus;
  requirements: Omit<BadgeRequirement, 'id'>[];
}

export interface UpdateBadgeProgressDto {
  progress: number;
  status: BadgeStatus;
  requirements: Pick<BadgeRequirement, 'id' | 'completed'>[];
} 