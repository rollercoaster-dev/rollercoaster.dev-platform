/**
 * Badge Service
 * Handles all API interactions for badges
 */
import type { Badge, CreateBadgeDto, UpdateBadgeProgressDto } from '../../shared/types/badge'

// Base API URL - dynamically set based on environment
const API_URL = process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3000'
const BADGES_ENDPOINT = `${API_URL}/api/badges`

export const badgeService = {
  /**
   * Get all badges
   */
  async getBadges(): Promise<Badge[]> {
    try {
      const response = await fetch(BADGES_ENDPOINT)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch badges: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching badges:', error)
      throw error
    }
  },
  
  /**
   * Get a badge by ID
   */
  async getBadgeById(id: string): Promise<Badge> {
    try {
      const response = await fetch(`${BADGES_ENDPOINT}/${id}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch badge: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error fetching badge ${id}:`, error)
      throw error
    }
  },
  
  /**
   * Create a new badge
   */
  async createBadge(badge: CreateBadgeDto): Promise<Badge> {
    try {
      const response = await fetch(BADGES_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(badge),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to create badge: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error creating badge:', error)
      throw error
    }
  },
  
  /**
   * Update a badge
   */
  async updateBadge(id: string, badge: Partial<Badge>): Promise<Badge> {
    try {
      const response = await fetch(`${BADGES_ENDPOINT}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(badge),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to update badge: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error updating badge ${id}:`, error)
      throw error
    }
  },
  
  /**
   * Update badge progress
   */
  async updateBadgeProgress(id: string, progressData: UpdateBadgeProgressDto): Promise<Badge> {
    try {
      const response = await fetch(`${BADGES_ENDPOINT}/${id}/progress`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progressData),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to update badge progress: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error updating badge progress ${id}:`, error)
      throw error
    }
  },
  
  /**
   * Delete a badge
   */
  async deleteBadge(id: string): Promise<void> {
    try {
      const response = await fetch(`${BADGES_ENDPOINT}/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error(`Failed to delete badge: ${response.statusText}`)
      }
    } catch (error) {
      console.error(`Error deleting badge ${id}:`, error)
      throw error
    }
  },
} 