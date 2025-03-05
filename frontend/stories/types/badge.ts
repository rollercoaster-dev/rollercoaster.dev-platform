export enum BadgeStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  status: BadgeStatus;
  progress: number;
} 