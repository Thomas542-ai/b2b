// Simple test to verify useApi hook doesn't cause infinite cycles
// This is a basic test - in a real project you'd use Jest/React Testing Library

import { renderHook, act } from '@testing-library/react'
import { useApi } from './useApi'

// Mock fetch
global.fetch = jest.fn()

// Mock toast
jest.mock('react-hot-toast', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}))

describe('useApi Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Clear the global cache between tests
    // Note: In a real implementation, you'd want to expose a way to clear the cache
  })

  it('should not cause infinite cycles', async () => {
    const mockData = { test: 'data' }
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    })

    const { result } = renderHook(() =>
      useApi({
        url: '/test',
        cacheTime: 1000
      })
    )

    // Wait for the request to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    // Should have data without infinite loops
    expect(result.current.data).toEqual(mockData)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should handle rate limiting without infinite cycles', async () => {
    // Mock a 429 response
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests'
    })

    const { result } = renderHook(() =>
      useApi({
        url: '/test',
        retryAttempts: 2,
        retryDelay: 100
      })
    )

    // Wait for retry attempts
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 500))
    })

    // Should eventually stop retrying and show error
    expect(result.current.error).toBeTruthy()
    expect(result.current.isLoading).toBe(false)
  })
})
