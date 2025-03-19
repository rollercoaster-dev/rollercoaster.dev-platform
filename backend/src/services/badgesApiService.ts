import axios from 'axios';
import type { Badge, CreateBadgeDto, BadgeRequirement, UpdateBadgeProgressDto } from '../../../shared/types/badge';

// Default to localhost:7777 for bun-badges
const BADGES_API_URL = process.env.BADGES_API_URL || 'http://localhost:7777';

/**
 * Service for interacting with the external bun-badges API
 */
export const badgesApiService = {
  /**
   * Get all badges from bun-badges
   */
  async getAllBadges(): Promise<Badge[]> {
    try {
      const response = await axios.get(`${BADGES_API_URL}/badges`);
      return response.data;
    } catch (error) {
      console.error('Error fetching badges from bun-badges:', error);
      throw new Error('Failed to fetch badges from bun-badges');
    }
  },

  /**
   * Get a single badge by ID
   */
  async getBadge(id: string): Promise<Badge> {
    try {
      const response = await axios.get(`${BADGES_API_URL}/badges/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching badge ${id} from bun-badges:`, error);
      throw new Error(`Failed to fetch badge ${id} from bun-badges`);
    }
  },

  /**
   * Create a new badge
   */
  async createBadge(badge: CreateBadgeDto): Promise<Badge> {
    try {
      const response = await axios.post(`${BADGES_API_URL}/badges`, badge);
      return response.data;
    } catch (error) {
      console.error('Error creating badge in bun-badges:', error);
      throw new Error('Failed to create badge in bun-badges');
    }
  },

  /**
   * Update an existing badge
   */
  async updateBadge(id: string, badge: Partial<Badge>): Promise<Badge> {
    try {
      const response = await axios.put(`${BADGES_API_URL}/badges/${id}`, badge);
      return response.data;
    } catch (error) {
      console.error(`Error updating badge ${id} in bun-badges:`, error);
      throw new Error(`Failed to update badge ${id} in bun-badges`);
    }
  },

  /**
   * Update badge progress
   */
  async updateBadgeProgress(id: string, progressData: UpdateBadgeProgressDto): Promise<Badge> {
    try {
      const response = await axios.patch(`${BADGES_API_URL}/badges/${id}/progress`, progressData);
      return response.data;
    } catch (error) {
      console.error(`Error updating badge ${id} progress in bun-badges:`, error);
      throw new Error(`Failed to update badge ${id} progress in bun-badges`);
    }
  },

  /**
   * Delete a badge
   */
  async deleteBadge(id: string): Promise<{ success: boolean }> {
    try {
      const response = await axios.delete(`${BADGES_API_URL}/badges/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting badge ${id} from bun-badges:`, error);
      throw new Error(`Failed to delete badge ${id} from bun-badges`);
    }
  },

  /**
   * Check if bun-badges is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      await axios.get(`${BADGES_API_URL}/health`);
      return true;
    } catch (error) {
      console.error('Bun-badges service is not available:', error);
      return false;
    }
  }
};