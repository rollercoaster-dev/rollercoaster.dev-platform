import axios from 'axios';
import type { Badge, CreateBadgeDto, BadgeRequirement, UpdateBadgeProgressDto } from '../../../shared/types/badge';

// Default to localhost:3001 for development
const BADGE_ENGINE_URL = process.env.BADGE_ENGINE_URL || 'http://localhost:3001/api';

/**
 * Service for interacting with the external badge-engine API
 */
export const badgeEngineService = {
  /**
   * Get all badges from badge-engine
   */
  async getAllBadges(): Promise<Badge[]> {
    try {
      const response = await axios.get(`${BADGE_ENGINE_URL}/badges`);
      return response.data;
    } catch (error) {
      console.error('Error fetching badges from badge-engine:', error);
      throw new Error('Failed to fetch badges from badge-engine');
    }
  },
  
  /**
   * Get a single badge by ID
   */
  async getBadge(id: string): Promise<Badge> {
    try {
      const response = await axios.get(`${BADGE_ENGINE_URL}/badges/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching badge ${id} from badge-engine:`, error);
      throw new Error(`Failed to fetch badge ${id} from badge-engine`);
    }
  },
  
  /**
   * Create a new badge
   */
  async createBadge(badge: CreateBadgeDto): Promise<Badge> {
    try {
      const response = await axios.post(`${BADGE_ENGINE_URL}/badges`, badge);
      return response.data;
    } catch (error) {
      console.error('Error creating badge in badge-engine:', error);
      throw new Error('Failed to create badge in badge-engine');
    }
  },
  
  /**
   * Update an existing badge
   */
  async updateBadge(id: string, badge: Partial<Badge>): Promise<Badge> {
    try {
      const response = await axios.put(`${BADGE_ENGINE_URL}/badges/${id}`, badge);
      return response.data;
    } catch (error) {
      console.error(`Error updating badge ${id} in badge-engine:`, error);
      throw new Error(`Failed to update badge ${id} in badge-engine`);
    }
  },
  
  /**
   * Update badge progress
   */
  async updateBadgeProgress(id: string, progressData: UpdateBadgeProgressDto): Promise<Badge> {
    try {
      const response = await axios.patch(`${BADGE_ENGINE_URL}/badges/${id}/progress`, progressData);
      return response.data;
    } catch (error) {
      console.error(`Error updating badge ${id} progress in badge-engine:`, error);
      throw new Error(`Failed to update badge ${id} progress in badge-engine`);
    }
  },
  
  /**
   * Delete a badge
   */
  async deleteBadge(id: string): Promise<{ success: boolean }> {
    try {
      const response = await axios.delete(`${BADGE_ENGINE_URL}/badges/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting badge ${id} from badge-engine:`, error);
      throw new Error(`Failed to delete badge ${id} from badge-engine`);
    }
  },

  /**
   * Check if badge-engine is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      await axios.get(`${BADGE_ENGINE_URL}/health`);
      return true;
    } catch (error) {
      console.error('Badge-engine service is not available:', error);
      return false;
    }
  }
};