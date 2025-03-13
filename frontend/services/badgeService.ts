/**
 * Badge Service
 * Handles all API interactions for badges
 * Supports integration with badge-engine API
 */
import type { Badge, CreateBadgeDto, UpdateBadgeProgressDto } from '../../shared/types/badge'

// Base API URL - dynamically set based on environment
const API_URL = process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3001'
const BADGES_ENDPOINT = `${API_URL}/api/badges`

// Custom error types
export class BadgeServiceError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message)
    this.name = 'BadgeServiceError'
  }
}

export class BadgeNotFoundError extends BadgeServiceError {
  constructor(id: string) {
    super(`Badge with ID ${id} not found`, 404)
    this.name = 'BadgeNotFoundError'
  }
}

export class BadgeValidationError extends BadgeServiceError {
  constructor(message: string) {
    super(message, 400)
    this.name = 'BadgeValidationError'
  }
}

export const badgeService = {
  /**
   * Check if a badge is managed by badge-engine
   */
  isBadgeEngineManaged(badge: Badge): boolean {
    return !!badge.externalId && badge.externalSource === 'badge-engine'
  },

  /**
   * Get all badges
   */
  async getBadges(): Promise<Badge[]> {
    try {
      const response = await fetch(BADGES_ENDPOINT)
      
      if (!response.ok) {
        if (response.status === 503) {
          throw new BadgeServiceError('Badge service is currently unavailable', 503)
        }
        throw new BadgeServiceError(`Failed to fetch badges: ${response.statusText}`, response.status)
      }
      
      return await response.json()
    } catch (error) {
      if (error instanceof BadgeServiceError) {
        throw error
      }
      console.error('Error fetching badges:', error)
      throw new BadgeServiceError('Failed to fetch badges due to network error')
    }
  },
  
  /**
   * Get a badge by ID
   */
  async getBadgeById(id: string): Promise<Badge> {
    try {
      const response = await fetch(`${BADGES_ENDPOINT}/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new BadgeNotFoundError(id)
        }
        if (response.status === 503) {
          throw new BadgeServiceError('Badge service is currently unavailable', 503)
        }
        throw new BadgeServiceError(`Failed to fetch badge: ${response.statusText}`, response.status)
      }
      
      return await response.json()
    } catch (error) {
      if (error instanceof BadgeServiceError) {
        throw error
      }
      console.error(`Error fetching badge ${id}:`, error)
      throw new BadgeServiceError(`Failed to fetch badge ${id} due to network error`)
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
        const errorData = await response.json().catch(() => ({ error: response.statusText }))
        
        if (response.status === 400) {
          throw new BadgeValidationError(errorData.error || 'Invalid badge data provided')
        }
        if (response.status === 503) {
          throw new BadgeServiceError('Badge service is currently unavailable', 503)
        }
        throw new BadgeServiceError(`Failed to create badge: ${errorData.error || response.statusText}`, response.status)
      }
      
      return await response.json()
    } catch (error) {
      if (error instanceof BadgeServiceError) {
        throw error
      }
      console.error('Error creating badge:', error)
      throw new BadgeServiceError('Failed to create badge due to network error')
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
        const errorData = await response.json().catch(() => ({ error: response.statusText }))
        
        if (response.status === 404) {
          throw new BadgeNotFoundError(id)
        }
        if (response.status === 400) {
          throw new BadgeValidationError(errorData.error || 'Invalid badge data provided')
        }
        if (response.status === 503) {
          throw new BadgeServiceError('Badge service is currently unavailable', 503)
        }
        throw new BadgeServiceError(`Failed to update badge: ${errorData.error || response.statusText}`, response.status)
      }
      
      return await response.json()
    } catch (error) {
      if (error instanceof BadgeServiceError) {
        throw error
      }
      console.error(`Error updating badge ${id}:`, error)
      throw new BadgeServiceError(`Failed to update badge ${id} due to network error`)
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
        const errorData = await response.json().catch(() => ({ error: response.statusText }))
        
        if (response.status === 404) {
          throw new BadgeNotFoundError(id)
        }
        if (response.status === 400) {
          throw new BadgeValidationError(errorData.error || 'Invalid progress data provided')
        }
        if (response.status === 503) {
          throw new BadgeServiceError('Badge service is currently unavailable', 503)
        }
        throw new BadgeServiceError(`Failed to update badge progress: ${errorData.error || response.statusText}`, response.status)
      }
      
      return await response.json()
    } catch (error) {
      if (error instanceof BadgeServiceError) {
        throw error
      }
      console.error(`Error updating badge progress ${id}:`, error)
      throw new BadgeServiceError(`Failed to update badge progress ${id} due to network error`)
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
        const errorData = await response.json().catch(() => ({ error: response.statusText }))
        
        if (response.status === 404) {
          throw new BadgeNotFoundError(id)
        }
        if (response.status === 503) {
          throw new BadgeServiceError('Badge service is currently unavailable', 503)
        }
        throw new BadgeServiceError(`Failed to delete badge: ${errorData.error || response.statusText}`, response.status)
      }
    } catch (error) {
      if (error instanceof BadgeServiceError) {
        throw error
      }
      console.error(`Error deleting badge ${id}:`, error)
      throw new BadgeServiceError(`Failed to delete badge ${id} due to network error`)
    }
  },
} 