/**
 * Tests for the Badge Service
 * 
 * Covers:
 * - Fetching badges
 * - Getting a badge by ID
 * - Creating badges
 * - Updating badges
 * - Updating badge progress
 * - Deleting badges
 * 
 * @group services
 * @group badges
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { badgeService } from '../../../services/badgeService'
import { mockBadges } from '../../fixtures/badges'
import { BadgeStatus } from '../../../../shared/types/badge'

// Mock global fetch
global.fetch = vi.fn()

// Helper to create response
function createFetchResponse(data: any, ok = true) {
  return {
    ok,
    json: () => Promise.resolve(data),
    statusText: ok ? 'OK' : 'Error'
  }
}

describe('Feature: Badge Service', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('getBadges', () => {
    it('should fetch all badges', async () => {
      // Arrange
      const mockResponse = createFetchResponse(mockBadges)
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      // Act
      const result = await badgeService.getBadges()

      // Assert
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/badges'))
      expect(result).toEqual(mockBadges)
    })

    it('should handle fetch error', async () => {
      // Arrange
      const mockResponse = createFetchResponse(null, false)
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      // Act & Assert
      await expect(badgeService.getBadges()).rejects.toThrow('Failed to fetch badges')
    })
  })

  describe('getBadgeById', () => {
    it('should fetch a badge by ID', async () => {
      // Arrange
      const badge = mockBadges[0]
      const mockResponse = createFetchResponse(badge)
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      // Act
      const result = await badgeService.getBadgeById(badge.id)

      // Assert
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining(`/api/badges/${badge.id}`))
      expect(result).toEqual(badge)
    })
  })

  describe('createBadge', () => {
    it('should create a badge', async () => {
      // Arrange
      const newBadge = { 
        name: 'New Badge', 
        description: 'Test description',
        progress: 0,
        status: BadgeStatus.NOT_STARTED,
        requirements: [
          {
            id: 'req-1',
            description: 'New requirement',
            completed: false
          }
        ]
      }
      const createdBadge = { 
        ...newBadge, 
        id: 'new-id', 
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      const mockResponse = createFetchResponse(createdBadge)
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      // Act
      const result = await badgeService.createBadge(newBadge)

      // Assert
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/badges'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newBadge)
        })
      )
      expect(result).toEqual(createdBadge)
    })
  })

  describe('updateBadge', () => {
    it('should update a badge', async () => {
      // Arrange
      const badge = mockBadges[0]
      const updateData = { name: 'Updated Badge' }
      const updatedBadge = { ...badge, ...updateData }
      const mockResponse = createFetchResponse(updatedBadge)
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      // Act
      const result = await badgeService.updateBadge(badge.id, updateData)

      // Assert
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/badges/${badge.id}`),
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        })
      )
      expect(result).toEqual(updatedBadge)
    })
  })

  describe('updateBadgeProgress', () => {
    it('should update badge progress', async () => {
      // Arrange
      const badge = mockBadges[0]
      const progressData = { progress: 75 }
      const updatedBadge = { ...badge, progress: 75 }
      const mockResponse = createFetchResponse(updatedBadge)
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      // Act
      const result = await badgeService.updateBadgeProgress(badge.id, progressData)

      // Assert
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/badges/${badge.id}/progress`),
        expect.objectContaining({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(progressData)
        })
      )
      expect(result).toEqual(updatedBadge)
    })
  })

  describe('deleteBadge', () => {
    it('should delete a badge', async () => {
      // Arrange
      const badge = mockBadges[0]
      const mockResponse = createFetchResponse({})
      vi.mocked(fetch).mockResolvedValueOnce(mockResponse as any)

      // Act
      await badgeService.deleteBadge(badge.id)

      // Assert
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/badges/${badge.id}`),
        expect.objectContaining({
          method: 'DELETE'
        })
      )
    })
  })
}) 